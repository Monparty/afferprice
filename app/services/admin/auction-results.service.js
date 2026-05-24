"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getAuctionResults() {
    const { data, error } = await supabaseAdmin
        .from("auction_results")
        .select("id, final_price, payment_status, created_at, product_id, winner_id, products(title, images_url, seller_id, state)")
        .order("created_at", { ascending: false });

    if (error) return { data: null, error };

    const userIds = [
        ...new Set([
            ...data.map((r) => r.winner_id).filter(Boolean),
            ...data.map((r) => r.products?.seller_id).filter(Boolean),
        ]),
    ];

    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const enriched = data.map((r) => ({
        ...r,
        winner: userMap[r.winner_id] || null,
        seller: userMap[r.products?.seller_id] || null,
    }));

    return { data: enriched, error: null };
}
