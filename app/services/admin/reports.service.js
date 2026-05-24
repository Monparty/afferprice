"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getReportSummary() {
    await requireAdmin();
    const [
        { data: paidResults },
        { count: totalUsers },
        { count: totalProducts },
        { count: totalBids },
        { count: soldCount },
    ] = await Promise.all([
        supabaseAdmin.from("auction_results").select("final_price").eq("payment_status", "paid"),
        supabaseAdmin.from("users_full").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("products").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("bids").select("*", { count: "exact", head: true }),
        supabaseAdmin.from("products").select("*", { count: "exact", head: true }).eq("state", "sold"),
    ]);

    const totalRevenue = (paidResults || []).reduce((sum, r) => sum + (r.final_price || 0), 0);
    const totalFee = totalRevenue * 0.05;

    return {
        totalRevenue,
        totalFee,
        totalUsers: totalUsers || 0,
        totalProducts: totalProducts || 0,
        totalBids: totalBids || 0,
        soldCount: soldCount || 0,
    };
}

export async function getRevenueByMonth() {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
        .from("auction_results")
        .select("final_price, created_at")
        .eq("payment_status", "paid");

    if (error) return { data: null, error };

    const byMonth = {};
    for (const r of data) {
        const key = (r.created_at || "").slice(0, 7);
        byMonth[key] = (byMonth[key] || 0) + (r.final_price || 0);
    }

    const rows = Object.entries(byMonth)
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) => b.month.localeCompare(a.month));

    return { data: rows, error: null };
}
