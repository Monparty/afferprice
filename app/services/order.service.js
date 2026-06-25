"use server";

import { requireUser } from "../lib/auth";
import { supabaseAdmin } from "../lib/supabase/admin";

/**
 * ผู้ซื้อ (ผู้ชนะ) ยืนยันรับสินค้า → shipping_status='delivered' + received_at + วิดีโอแกะกล่อง (optional)
 * verify ownership เอง (ผู้เรียกต้องเป็น winner) แล้วใช้ supabaseAdmin update
 * (RLS `shipments` เปิดแค่ SELECT — ผู้ซื้อ update เองผ่าน browser client ไม่ได้)
 */
export async function confirmReceipt({ auctionResultId, videoUrl = null }) {
    const user = await requireUser();

    const { data: ar, error } = await supabaseAdmin
        .from("auction_results")
        .select("id, winner_id, product_id")
        .eq("id", auctionResultId)
        .single();
    if (error || !ar) return { error: "not_found" };
    if (ar.winner_id !== user.id) return { error: "forbidden" };

    const { error: upErr } = await supabaseAdmin
        .from("shipments")
        .update({
            shipping_status: "delivered",
            received_at: new Date().toISOString(),
            unboxing_video_url: videoUrl,
        })
        .eq("auction_result_id", auctionResultId);
    if (upErr) return { error: upErr.message };

    // แจ้งเตือนผู้ขายว่าผู้ซื้อรับสินค้าแล้ว
    const { data: prod } = await supabaseAdmin
        .from("products")
        .select("seller_id, title")
        .eq("id", ar.product_id)
        .single();
    if (prod?.seller_id) {
        await supabaseAdmin.from("notifications").insert({
            user_id: prod.seller_id,
            type: "shipping",
            title: "ผู้ซื้อยืนยันรับสินค้าแล้ว",
            message: `ผู้ซื้อยืนยันรับสินค้า "${prod.title ?? ""}" เรียบร้อยแล้ว`,
        });
    }
    return { error: null };
}
