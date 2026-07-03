import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

// ผู้ใช้ขอถอนเงินจาก wallet → ตัดเงินทันที + สร้างคำขอ pending (RPC atomic + guard KYC/บัญชี/ยอด)
export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "wallet-withdraw"), limit: 5, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { amount } = await req.json();

        const n = Number(amount);
        if (!Number.isFinite(n) || n <= 0) {
            return NextResponse.json({ error: "invalid_withdrawal_amount" }, { status: 400 });
        }

        // ยอดเงินไม่รับจาก client เป็น source of truth — RPC เช็คกับ balance ใน DB เอง
        const { data, error } = await supabaseAdmin.rpc("request_withdrawal", {
            p_user_id: user.id,
            p_amount: Math.round(n),
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        await supabaseAdmin
            .channel(`wallet-${user.id}`)
            .send({ type: "broadcast", event: "update", payload: {} });

        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[wallet/withdraw]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
