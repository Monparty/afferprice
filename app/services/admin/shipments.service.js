"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getShipments() {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
        .from("shipments")
        .select("id, shipping_company, tracking_number, shipping_status, created_at, auction_result_id, auction_results(product_id, winner_id, products(title, images_url, seller_id))")
        .order("created_at", { ascending: false });

    if (error) return { data: null, error };

    const winnerIds = data.map((s) => s.auction_results?.winner_id).filter(Boolean);
    const sellerIds = data.map((s) => s.auction_results?.products?.seller_id).filter(Boolean);
    const userIds = [...new Set([...winnerIds, ...sellerIds])];

    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const enriched = data.map((s) => ({
        ...s,
        winner: userMap[s.auction_results?.winner_id] || null,
        seller: userMap[s.auction_results?.products?.seller_id] || null,
    }));

    return { data: enriched, error: null };
}

export async function updateShipmentStatus(id, status) {
    await requireAdmin();
    return supabaseAdmin.from("shipments").update({ shipping_status: status }).eq("id", id);
}
