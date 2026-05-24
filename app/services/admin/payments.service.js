"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getPayments() {
    const { data, error } = await supabaseAdmin
        .from("payments")
        .select("id, amount, payment_method, payment_status, transaction_ref, created_at, user_id, auction_result_id")
        .order("created_at", { ascending: false });

    if (error) return { data: null, error };

    const userIds = [...new Set(data.map((p) => p.user_id).filter(Boolean))];
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const enriched = data.map((p) => ({ ...p, user: userMap[p.user_id] || null }));

    return { data: enriched, error: null };
}
