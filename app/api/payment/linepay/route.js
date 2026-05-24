import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";
import crypto from "crypto";

const TOPUP_MIN = 20;
const TOPUP_MAX = 100000;

export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "linepay"), limit: 10, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { amount, purpose = "topup" } = await req.json();

        if (purpose !== "topup") {
            return NextResponse.json({ error: "invalid_purpose" }, { status: 400 });
        }
        const n = Number(amount);
        if (!Number.isFinite(n) || n < TOPUP_MIN || n > TOPUP_MAX) {
            return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
        }
        const safeAmount = Math.round(n);

        const chargeId = `LINEPAY-MOCK-${crypto.randomUUID()}`;

        const { error } = await supabaseAdmin.from("payments").insert({
            user_id: user.id,
            amount: safeAmount,
            payment_method: "linepay",
            payment_status: "pending",
            transaction_ref: chargeId,
            purpose,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ chargeId, redirectUrl: `#linepay-mock-${chargeId}` });
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[linepay]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
