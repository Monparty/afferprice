import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

async function omiseGet(path) {
    const auth = Buffer.from(`${process.env.OMISE_SECRET_KEY}:`).toString("base64");
    const res = await fetch(`https://api.omise.co${path}`, {
        headers: { Authorization: `Basic ${auth}` },
    });
    const data = await res.json();
    if (data.object === "error") throw new Error(data.message);
    return data;
}

function checkBasicAuth(req) {
    const expected = process.env.OMISE_WEBHOOK_USER;
    if (!expected) return true;
    const header = req.headers.get("authorization") || "";
    if (!header.startsWith("Basic ")) return false;
    try {
        const decoded = Buffer.from(header.slice(6), "base64").toString();
        const [user, pass = ""] = decoded.split(":");
        return user === expected && pass === (process.env.OMISE_WEBHOOK_PASSWORD ?? "");
    } catch {
        return false;
    }
}

export async function GET() {
    return NextResponse.json({ ok: true });
}

export async function POST(req) {
    const rl = rateLimit({ key: clientKey(req, "webhook"), limit: 60, windowMs: 60_000 });
    if (!rl.ok) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }
    if (!checkBasicAuth(req)) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    let event;
    try {
        event = await req.json();
    } catch {
        return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    if (event.key !== "charge.complete") {
        return NextResponse.json({ received: true });
    }

    const chargeId = event.data?.id;
    if (!chargeId || typeof chargeId !== "string") {
        return NextResponse.json({ error: "invalid_charge" }, { status: 400 });
    }

    let charge;
    try {
        charge = await omiseGet(`/charges/${encodeURIComponent(chargeId)}`);
    } catch (err) {
        console.error("[webhook] omise lookup failed", err.message);
        return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
    }

    const isSuccess = charge.status === "successful";

    const { data: payment } = await supabaseAdmin
        .from("payments")
        .update({
            payment_status: isSuccess ? "success" : "failed",
            paid_at: isSuccess ? new Date().toISOString() : null,
        })
        .eq("transaction_ref", charge.id)
        .select("id, user_id, amount, purpose, auction_result_id, payment_status")
        .single();

    if (isSuccess && payment) {
        if (Number(payment.amount) !== Number(charge.amount) / 100) {
            console.error("[webhook] amount mismatch", payment.id, payment.amount, charge.amount);
            return NextResponse.json({ error: "amount_mismatch" }, { status: 400 });
        }

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
