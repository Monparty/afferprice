import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ ok: true });
}

export async function POST(req) {
    const event = await req.json();

    if (event.key !== "charge.complete") {
        return NextResponse.json({ received: true });
    }

    const charge = event.data;
    const isSuccess = charge.status === "successful";

    const { data: payment } = await supabaseAdmin
        .from("payments")
        .update({
            payment_status: isSuccess ? "success" : "failed",
            paid_at: isSuccess ? new Date().toISOString() : null,
        })
        .eq("transaction_ref", charge.id)
        .select("id, user_id, amount, purpose, auction_result_id")
        .single();

    if (isSuccess && payment) {
        if (payment.purpose === "topup") {
            await supabaseAdmin.rpc("credit_wallet", { p_payment_id: payment.id });
            await supabaseAdmin
                .channel(`wallet-${payment.user_id}`)
                .send({ type: "broadcast", event: "update", payload: {} });
        } else if (payment.auction_result_id) {
            await supabaseAdmin
                .from("auction_results")
                .update({ payment_status: "paid" })
                .eq("id", payment.auction_result_id);
        }
    }

    return NextResponse.json({ received: true });
}
