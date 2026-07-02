import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

// ยกเลิกผลประมูลที่ผู้ชนะไม่ชำระเงินตามกำหนด (payment deadline) + ริบมัดจำ
// idempotent + guard ทั้งหมดอยู่ใน RPC expire_unpaid_auction (ตรวจ payment_due_at + payment_status)
// จึงไม่ต้อง requireUser (เหมือน /api/auction/end) — client ส่ง auctionResultId ปลอมไม่ได้ผล
export async function POST(request) {
    const rl = rateLimit({ key: clientKey(request, "auction-expire"), limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }
    const { auctionResultId } = await request.json();
    if (!auctionResultId) return NextResponse.json({ error: "auctionResultId required" }, { status: 400 });

    const { data, error } = await supabaseAdmin.rpc("expire_unpaid_auction", { p_auction_result_id: auctionResultId });
    if (error) {
        console.error("[auction/expire-unpaid]", auctionResultId, error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // แจ้งเตือนเฉพาะกรณียกเลิกจริง (expired) — already_processed/not_due ไม่ต้องแจ้ง
    if (data?.expired) {
        const amountText = Number(data.deposit_amount || 0).toLocaleString("th-TH");
        const notifications = [
            {
                user_id: data.winner_id,
                type: "payment",
                title: "หมดเวลาชำระเงิน",
                message: `คุณไม่ได้ชำระค่าประมูลภายในกำหนด ระบบยกเลิกรายการและริบเงินมัดจำ ฿${amountText}`,
            },
        ];
        if (data.seller_id) {
            notifications.push({
                user_id: data.seller_id,
                type: "payment",
                title: "ผู้ซื้อไม่ชำระเงิน",
                message: "ผู้ชนะไม่ได้ชำระค่าประมูลภายในกำหนด รายการถูกยกเลิก",
            });
        }
        await supabaseAdmin.from("notifications").insert(notifications);
    }

    return NextResponse.json(data);
}
