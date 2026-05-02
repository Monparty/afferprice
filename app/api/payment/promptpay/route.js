import Omise from "omise";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

const omise = Omise({ secretKey: process.env.OMISE_SECRET_KEY });

export async function POST(req) {
    const { auctionResultId, userId, amount } = await req.json();

    // amount ต้องเป็น satang (บาท * 100)
    const amountSatang = Math.round(amount * 100);

    const source = await omise.sources.create({
        type: "promptpay",
        amount: amountSatang,
        currency: "THB",
    });

    const charge = await omise.charges.create({
        amount: amountSatang,
        currency: "THB",
        source: source.id,
    });

    const { error } = await supabaseAdmin.from("payments").insert({
        auction_result_id: auctionResultId,
        user_id: userId,
        amount,
        payment_method: "promptpay",
        payment_status: "pending",
        transaction_ref: charge.id,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        chargeId: charge.id,
        qrCodeUrl: charge.source.scannable_code.image.download_uri,
        expiresAt: charge.expires_at,
    });
}
