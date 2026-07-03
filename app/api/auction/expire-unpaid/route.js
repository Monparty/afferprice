import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { expireUnpaidAuction } from "@/app/lib/auction/reconcile";
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

    const result = await expireUnpaidAuction(auctionResultId);
    if (result?.error) {
        return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
    }
    return NextResponse.json(result);
}
