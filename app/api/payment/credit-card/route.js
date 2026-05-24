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
        const rl = rateLimit({ key: clientKey(req, "credit-card"), limit: 10, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { amount: clientAmount, omiseToken, purpose = "topup", auctionResultId } = await req.json();
        if (!omiseToken) {
            return NextResponse.json({ error: "missing_token" }, { status: 400 });
        }

        let amount;
        let finalAuctionResultId = null;

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
            finalAuctionResultId = auctionResultId;
        } else if (purpose === "topup") {
            const n = Number(clientAmount);
            if (!Number.isFinite(n) || n < TOPUP_MIN || n > TOPUP_MAX) {
                return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
            }
            amount = Math.round(n);
        } else {
            return NextResponse.json({ error: "invalid_purpose" }, { status: 400 });
        }

        const charge = await omiseFetch("/charges", {
            amount: amount * 100,
            currency: "THB",
            card: omiseToken,
        });

        const { error } = await supabaseAdmin.from("payments").insert({
            auction_result_id: finalAuctionResultId,
            user_id: user.id,
            amount,
            payment_method: "credit_card",
            payment_status: "pending",
            transaction_ref: charge.id,
            purpose,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ chargeId: charge.id, status: charge.status });
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[credit-card]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
