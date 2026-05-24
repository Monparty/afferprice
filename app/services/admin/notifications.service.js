"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getAllNotifications({ limit = 200 } = {}) {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
        .from("notifications")
        .select("id, user_id, type, title, message, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) return { data: null, error };

    const userIds = [...new Set(data.map((n) => n.user_id).filter(Boolean))];
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const enriched = data.map((n) => ({ ...n, user: userMap[n.user_id] || null }));

    return { data: enriched, error: null };
}
