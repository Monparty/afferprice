"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getWalletBalances() {
    const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("id, first_name, last_name, wallet_balance")
        .order("wallet_balance", { ascending: false });
    return { data, error };
}

export async function getWalletTransactions({ limit = 100 } = {}) {
    const { data, error } = await supabaseAdmin
        .from("wallet_transactions")
        .select("id, user_id, amount, type, reference_id, balance_after, note, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return { data: null, error };

    const userIds = [...new Set(data.map((t) => t.user_id))];
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const enriched = data.map((t) => ({ ...t, user: userMap[t.user_id] || null }));

    return { data: enriched, error: null };
}
