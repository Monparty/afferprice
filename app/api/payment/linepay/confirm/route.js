import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { chargeId } = await req.json();
        if (!chargeId) return NextResponse.json({ error: "missing_params" }, { status: 400 });

        const { data: payment, error } = await supabaseAdmin
            .from("payments")
            .update({ payment_status: "success", paid_at: new Date().toISOString() })
            .eq("transaction_ref", chargeId)
            .eq("payment_status", "pending")
            .select("id, user_id, purpose, auction_result_id")
            .single();

        if (error || !payment) {
            return NextResponse.json({ error: error?.message || "payment_not_found" }, { status: 400 });
        }

        if (payment.purpose === "topup") {
            const { error: rpcErr } = await supabaseAdmin.rpc("credit_wallet", { p_payment_id: payment.id });
            if (rpcErr) return NextResponse.json({ error: rpcErr.message }, { status: 500 });
            await supabaseAdmin
                .channel(`wallet-${payment.user_id}`)
                .send({ type: "broadcast", event: "update", payload: {} });
        } else if (payment.auction_result_id) {
            await supabaseAdmin
                .from("auction_results")
                .update({ payment_status: "paid" })
                .eq("id", payment.auction_result_id);
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[linepay/confirm]", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
