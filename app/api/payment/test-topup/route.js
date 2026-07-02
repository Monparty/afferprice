// ⚠️ ช่องทางเติมเงินสำหรับเทสเท่านั้น — เครดิต wallet ตรงโดยไม่ผ่าน payment gateway
// ปิดตัวเองบน production build (NODE_ENV) — ลบไฟล์นี้ทิ้งเมื่อเลิกใช้
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";
import crypto from "crypto";

const TOPUP_MIN = 20;
const TOPUP_MAX = 100000;

export async function POST(req) {
    try {
        if (process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "not_found" }, { status: 404 });
        }
        const rl = rateLimit({ key: clientKey(req, "test-topup"), limit: 10, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { amount } = await req.json();

        const n = Number(amount);
        if (!Number.isFinite(n) || n < TOPUP_MIN || n > TOPUP_MAX) {
            return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
        }
        const safeAmount = Math.round(n);

        const { data: payment, error } = await supabaseAdmin
            .from("payments")
            .insert({
                user_id: user.id,
                amount: safeAmount,
                payment_method: "bank",
                payment_status: "success",
                paid_at: new Date().toISOString(),
                transaction_ref: `TEST-TOPUP-${crypto.randomUUID()}`,
                purpose: "topup",
            })
            .select("id")
            .single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        const { data: credited, error: rpcErr } = await supabaseAdmin.rpc("credit_wallet", {
            p_payment_id: payment.id,
        });
        if (rpcErr) return NextResponse.json({ error: rpcErr.message }, { status: 500 });

        await supabaseAdmin
            .channel(`wallet-${user.id}`)
            .send({ type: "broadcast", event: "update", payload: {} });

        return NextResponse.json({ ok: true, balance_after: credited?.balance_after });
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[test-topup]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
