import { reconcileAll } from "@/app/lib/auction/reconcile";
import { NextResponse } from "next/server";

// Cron endpoint — reconcile ทั้งระบบฝั่ง server (ปิดประมูลหมดเวลา + ยกเลิกผลที่ผู้ชนะไม่จ่าย)
// ตั้งเวลาเรียกจาก external scheduler (Vercel Cron / cron-job.org / GitHub Actions / Supabase pg_cron+pg_net)
//   ส่ง header `Authorization: Bearer <CRON_SECRET>` หรือ query `?key=<CRON_SECRET>`
// ต้องตั้ง env CRON_SECRET (server-only) ก่อนใช้ — ไม่ตั้ง = ปิดใช้งาน (501)
function authorized(req) {
    const secret = process.env.CRON_SECRET;
    if (!secret) return null; // ยังไม่ตั้งค่า → not configured
    const header = req.headers.get("authorization") || "";
    const bearer = header.startsWith("Bearer ") ? header.slice(7) : null;
    const queryKey = new URL(req.url).searchParams.get("key");
    return bearer === secret || queryKey === secret;
}

async function handle(req) {
    const auth = authorized(req);
    if (auth === null) return NextResponse.json({ error: "cron_not_configured" }, { status: 501 });
    if (!auth) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const result = await reconcileAll();
    return NextResponse.json({ ok: true, ...result });
}

// Vercel Cron เรียกด้วย GET; รองรับ POST ด้วยสำหรับ scheduler อื่น
export async function GET(req) {
    return handle(req);
}

export async function POST(req) {
    return handle(req);
}
