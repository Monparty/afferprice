"use server";

import { supabaseAdmin } from "../lib/supabase/admin";

/**
 * ข้อมูลสำหรับหน้า Landing ที่ RLS บล็อก anon/ผู้ใช้ทั่วไป
 * (sold products + auction_results) — ใช้ supabaseAdmin bypass RLS
 * แล้วคืนเฉพาะ field ที่ปลอดภัยเปิดสาธารณะ (ราคา auction เป็นข้อมูล public,
 * ไม่มี PII ของผู้ซื้อ/ผู้ขาย)
 */

export async function getRecentlySoldPublic(limit = 6) {
    const { data, error } = await supabaseAdmin
        .from("products")
        .select("id, title, images_url, auction_end_time, auction_results(final_price)")
        .in("state", ["sold", "order"])
        .order("auction_end_time", { ascending: false })
        .limit(limit);

    if (error) return { data: [], error };

    const rows = (data ?? []).map((p) => ({
        id: p.id,
        title: p.title,
        image: p.images_url?.[0]?.url ?? null,
        finalPrice: p.auction_results?.[0]?.final_price ?? null,
        endTime: p.auction_end_time,
    }));
    return { data: rows, error: null };
}

export async function getPlatformStats() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalQ, collectorsQ, soldQ, cancelledQ, monthQ] = await Promise.all([
        supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
        supabaseAdmin.from("products").select("id", { count: "exact", head: true }).in("state", ["sold", "order"]),
        supabaseAdmin.from("products").select("id", { count: "exact", head: true }).eq("state", "cancelled"),
        supabaseAdmin
            .from("products")
            .select("auction_results(final_price)")
            .in("state", ["sold", "order"])
            .gte("auction_end_time", startOfMonth.toISOString()),
    ]);

    const sold = soldQ.count ?? 0;
    const cancelled = cancelledQ.count ?? 0;
    const successRate = sold + cancelled > 0 ? (sold / (sold + cancelled)) * 100 : 0;
    const monthlyValue = (monthQ.data ?? []).reduce(
        (sum, p) => sum + (p.auction_results?.[0]?.final_price ?? 0),
        0,
    );

    return {
        data: {
            totalAuctions: totalQ.count ?? 0,
            activeCollectors: collectorsQ.count ?? 0,
            monthlyValue,
            successRate,
            soldCount: sold,
        },
        error: null,
    };
}
