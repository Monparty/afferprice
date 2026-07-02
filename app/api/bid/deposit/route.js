import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

// วางเงินมัดจำ 20% ของราคาปัจจุบันก่อนประมูลครั้งแรก (ตัดจาก wallet)
// ยอดคำนวณฝั่ง DB ใน RPC place_bid_deposit — ไม่รับ amount จาก client
export async function POST(req) {
    try {
        // 5/min เท่า wallet/charge — endpoint นี้ตัดเงิน wallet ทันทีเหมือนกัน
        const rl = rateLimit({ key: clientKey(req, "bid-deposit"), limit: 5, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: "missing_product_id" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin.rpc("place_bid_deposit", {
            p_user_id: user.id,
            p_product_id: productId,
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        // แจ้ง client ที่ subscribe wallet channel ให้ re-fetch balance (payload ว่างเสมอ)
        await supabaseAdmin
            .channel(`wallet-${user.id}`)
            .send({ type: "broadcast", event: "update", payload: {} });

        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error("[bid/deposit]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
