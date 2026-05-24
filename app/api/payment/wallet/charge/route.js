import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

const AUCTION_FEE_RATE = 0.05;

export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "wallet-charge"), limit: 5, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { auctionResultId } = await req.json();

        if (!auctionResultId) {
            return NextResponse.json({ error: "missing_params" }, { status: 400 });
        }

        const { data: result, error: resultErr } = await supabaseAdmin
            .from("auction_results")
            .select("id, winner_id, final_price, payment_status")
            .eq("id", auctionResultId)
            .single();

        if (resultErr || !result) {
            return NextResponse.json({ error: "auction_result_not_found" }, { status: 404 });
        }
        if (result.winner_id !== user.id) {
            return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }
        if (result.payment_status === "paid") {
            return NextResponse.json({ error: "already_paid" }, { status: 409 });
        }

        const finalPrice = Number(result.final_price);
        const total = Math.round(finalPrice + finalPrice * AUCTION_FEE_RATE);

        const { data, error } = await supabaseAdmin.rpc("charge_wallet", {
            p_user_id: user.id,
            p_amount: total,
            p_auction_result_id: auctionResultId,
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        // Broadcast empty payload — anyone subscribed knows to re-fetch with auth,
        // ห้ามใส่ balance_after ใน broadcast (ใครก็ subscribe channel `wallet-{id}` ได้)
        await supabaseAdmin
            .channel(`wallet-${user.id}`)
            .send({ type: "broadcast", event: "update", payload: {} });

        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[wallet/charge]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
