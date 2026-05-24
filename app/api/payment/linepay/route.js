import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    try {
        const { userId, amount, purpose = "topup" } = await req.json();
        if (!userId || !amount) return NextResponse.json({ error: "missing_params" }, { status: 400 });

        const chargeId = `LINEPAY-MOCK-${crypto.randomUUID()}`;

        const { error } = await supabaseAdmin.from("payments").insert({
            user_id: userId,
            amount,
            payment_method: "linepay",
            payment_status: "pending",
            transaction_ref: chargeId,
            purpose,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ chargeId, redirectUrl: `#linepay-mock-${chargeId}` });
    } catch (err) {
        console.error("[linepay]", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
