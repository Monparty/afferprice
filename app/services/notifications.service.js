import { supabase } from "../lib/supabase/client";

export async function getMyNotifications() {
    return supabase
        .from("notifications")
        .select("id, type, title, message, is_read, created_at")
        .order("created_at", { ascending: false })
        .limit(30);
}

export async function getUnreadCount() {
    return supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);
}

export async function markAllNotificationsRead() {
    return supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);
}
