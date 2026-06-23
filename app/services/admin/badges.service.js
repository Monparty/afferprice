"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";
import { ROUTES } from "../../admin/constants/routes";

// ตัวนับ badge สำหรับเมนู admin — key = route ของเมนู (ต้องตรงกับ menu.url ใน AdminLayout)
// เพิ่ม badge ใหม่ = เพิ่ม 1 entry ที่นี่ (scale ได้ง่าย ไม่ต้องแก้ layout)
const BADGE_SOURCES = [
    {
        // สินค้าที่รอตรวจสอบ (state = pending_review)
        key: ROUTES.ADMIN_PRODUCT,
        count: () =>
            supabaseAdmin
                .from("products")
                .select("*", { count: "exact", head: true })
                .eq("state", "pending_review"),
    },
    {
        // ผู้ใช้ที่รอตรวจสอบ KYC (is_kyc = pending)
        key: ROUTES.ADMIN_USERS,
        count: () =>
            supabaseAdmin
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq("is_kyc", "pending"),
    },
];

export async function getAdminBadgeCounts() {
    await requireAdmin();

    const results = await Promise.all(BADGE_SOURCES.map((s) => s.count()));

    const counts = {};
    BADGE_SOURCES.forEach((s, i) => {
        counts[s.key] = results[i]?.count || 0;
    });
    return counts;
}
