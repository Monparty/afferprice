import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

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
        const { auctionResultId, userId, amount } = await req.json();
        const amountSatang = Math.round(amount * 100);

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

        if (auctionResultId) {
            const { error } = await supabaseAdmin.from("payments").insert({
                auction_result_id: auctionResultId,
                user_id: userId,
                amount,
                payment_method: "promptpay",
                payment_status: "pending",
                transaction_ref: charge.id,
            });
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            chargeId: charge.id,
            qrCodeUrl: charge.source.scannable_code.image.download_uri,
            expiresAt: charge.expires_at,
        });
    } catch (err) {
        console.error("[promptpay]", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
