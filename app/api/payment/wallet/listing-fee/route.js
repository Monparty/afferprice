import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

const LISTING_FEE_RATE = 0.05;

export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "wallet-listing-fee"), limit: 5, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: "missing_product_id" }, { status: 400 });
        }

        const { data: product, error: productErr } = await supabaseAdmin
            .from("products")
            .select("id, seller_id, start_price, state")
            .eq("id", productId)
            .single();

        if (productErr || !product) {
            return NextResponse.json({ error: "product_not_found" }, { status: 404 });
        }
        if (product.seller_id !== user.id) {
            return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }

        const { data: sellerProfile } = await supabaseAdmin
            .from("profiles")
            .select("is_kyc")
            .eq("id", user.id)
            .single();
        if (sellerProfile?.is_kyc !== "approved") {
            return NextResponse.json({ error: "seller_kyc_not_approved" }, { status: 403 });
        }

        const startPrice = Number(product.start_price);
        if (!Number.isFinite(startPrice) || startPrice <= 0) {
            return NextResponse.json({ error: "invalid_start_price" }, { status: 400 });
        }
        const amount = Math.max(1, Math.round(startPrice * LISTING_FEE_RATE));

        const { data, error } = await supabaseAdmin.rpc("charge_wallet_listing", {
            p_user_id: user.id,
            p_amount: amount,
            p_product_id: productId,
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        await supabaseAdmin
            .channel(`wallet-${user.id}`)
            .send({ type: "broadcast", event: "update", payload: {} });

        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[wallet/listing-fee]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
