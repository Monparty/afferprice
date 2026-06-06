import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

const AUCTION_FEE_RATE = 0.05;
const TOPUP_MIN = 20;
const TOPUP_MAX = 100000;

async function omiseFetch(path, body) {
    const auth = Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString("base64");
    const res = await fetch(`https://api.omise.co${path}`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.object === "error") throw new Error(data.message);
    return data;
}

export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "promptpay"), limit: 10, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { auctionResultId, productId, amount: clientAmount, purpose = "auction" } = await req.json();

        let amount;
        let resolvedProductId = null;

        if (purpose === "auction") {
            if (!auctionResultId) {
                return NextResponse.json({ error: "missing_auction_result" }, { status: 400 });
            }
            const { data: result } = await supabaseAdmin
                .from("auction_results")
                .select("id, winner_id, final_price, payment_status")
                .eq("id", auctionResultId)
                .single();
            if (!result) return NextResponse.json({ error: "auction_result_not_found" }, { status: 404 });
            if (result.winner_id !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
            if (result.payment_status === "paid") {
                return NextResponse.json({ error: "already_paid" }, { status: 409 });
            }
            const finalPrice = Number(result.final_price);
            amount = Math.round(finalPrice + finalPrice * AUCTION_FEE_RATE);
        } else if (purpose === "topup") {
            const n = Number(clientAmount);
            if (!Number.isFinite(n) || n < TOPUP_MIN || n > TOPUP_MAX) {
                return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
            }
            amount = Math.round(n);
        } else if (purpose === "listing_fee") {
            if (!productId) {
                return NextResponse.json({ error: "missing_product_id" }, { status: 400 });
            }
            const { data: product } = await supabaseAdmin
                .from("products")
                .select("id, seller_id, start_price, state")
                .eq("id", productId)
                .single();
            if (!product) return NextResponse.json({ error: "product_not_found" }, { status: 404 });
            if (product.seller_id !== user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
            const { data: sellerProfile } = await supabaseAdmin
                .from("profiles")
                .select("is_kyc")
                .eq("id", user.id)
                .single();
            if (sellerProfile?.is_kyc !== "approved") {
                return NextResponse.json({ error: "seller_kyc_not_approved" }, { status: 403 });
            }
            const { data: existing } = await supabaseAdmin
                .from("payments")
                .select("id")
                .eq("product_id", productId)
                .eq("purpose", "listing_fee")
                .eq("payment_status", "success")
                .maybeSingle();
            if (existing) return NextResponse.json({ error: "already_paid" }, { status: 409 });
            const startPrice = Number(product.start_price);
            amount = Math.max(1, Math.round(startPrice * AUCTION_FEE_RATE));
            resolvedProductId = productId;
        } else {
            return NextResponse.json({ error: "invalid_purpose" }, { status: 400 });
        }

        const amountSatang = amount * 100;

        const source = await omiseFetch("/sources", {
            type: "promptpay",
            amount: amountSatang,
            currency: "THB",
        });

        const charge = await omiseFetch("/charges", {
            amount: amountSatang,
            currency: "THB",
            source: source.id,
        });

        const { error } = await supabaseAdmin.from("payments").insert({
            auction_result_id: purpose === "auction" ? auctionResultId : null,
            product_id: resolvedProductId,
            user_id: user.id,
            amount,
            payment_method: "promptpay",
            payment_status: "pending",
            transaction_ref: charge.id,
            purpose,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({
            chargeId: charge.id,
            qrCodeUrl: charge.source.scannable_code.image.download_uri,
            expiresAt: charge.expires_at,
        });
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[promptpay]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
