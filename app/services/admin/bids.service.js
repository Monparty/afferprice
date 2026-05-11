"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getAllBids() {
    const { data: bids, error } = await supabaseAdmin
        .from("bids")
        .select("id, bid_price, is_winning, bid_time, user_id, products(title, images_url)")
        .order("bid_time", { ascending: false });

    if (error) return { data: null, error };

    const userIds = [...new Set(bids.map((b) => b.user_id))];
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const data = bids.map((b) => ({ ...b, profile: userMap[b.user_id] ?? null }));

    return { data, error: null };
}
