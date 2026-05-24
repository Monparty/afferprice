import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "linepay-confirm"), limit: 10, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { chargeId } = await req.json();
        if (!chargeId) return NextResponse.json({ error: "missing_params" }, { status: 400 });

        const { data: existing, error: lookupErr } = await supabaseAdmin
            .from("payments")
            .select("id, user_id, payment_status")
            .eq("transaction_ref", chargeId)
            .single();

        if (lookupErr || !existing) {
            return NextResponse.json({ error: "payment_not_found" }, { status: 404 });
        }
        if (existing.user_id !== user.id) {
            return NextResponse.json({ error: "forbidden" }, { status: 403 });
        }
        if (existing.payment_status !== "pending") {
            return NextResponse.json({ error: "invalid_state" }, { status: 409 });
        }

        const { data: payment, error } = await supabaseAdmin
            .from("payments")
            .update({ payment_status: "success", paid_at: new Date().toISOString() })
            .eq("id", existing.id)
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
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[linepay/confirm]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
