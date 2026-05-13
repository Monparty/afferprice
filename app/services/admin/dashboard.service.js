"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getDashboardStats() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [{ count: activeCount }, { count: pendingCount }, { data: paidResults }, { count: newUsersCount }] =
        await Promise.all([
            supabaseAdmin.from("products").select("*", { count: "exact", head: true }).eq("state", "active"),
            supabaseAdmin
                .from("products")
                .select("*", { count: "exact", head: true })
                .eq("state", "pending_review"),
            supabaseAdmin.from("auction_results").select("final_price").eq("payment_status", "paid"),
            supabaseAdmin
                .from("users_full")
                .select("*", { count: "exact", head: true })
                .gte("created_at", sevenDaysAgo),
        ]);

    const totalRevenue = (paidResults || []).reduce((sum, r) => sum + (r.final_price || 0), 0);

    return {
        activeCount: activeCount || 0,
        pendingCount: pendingCount || 0,
        totalRevenue,
        newUsersCount: newUsersCount || 0,
    };
}
