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
        const { userId, amount, omiseToken, purpose = "topup" } = await req.json();
        if (!userId || !amount || !omiseToken) {
            return NextResponse.json({ error: "missing_params" }, { status: 400 });
        }

        const charge = await omiseFetch("/charges", {
            amount: Math.round(amount * 100),
            currency: "THB",
            card: omiseToken,
        });

        const { error } = await supabaseAdmin.from("payments").insert({
            user_id: userId,
            amount,
            payment_method: "credit_card",
            payment_status: "pending",
            transaction_ref: charge.id,
            purpose,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ chargeId: charge.id, status: charge.status });
    } catch (err) {
        console.error("[credit-card]", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
