"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getAllBids() {
    await requireAdmin();
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

export async function getBidsGroupedByProduct() {
    await requireAdmin();
    const { data: bids, error } = await supabaseAdmin
        .from("bids")
        .select("id, bid_price, bid_time, user_id, product_id, products(id, title, images_url, state, start_price)")
        .order("bid_time", { ascending: false });

    if (error) return { data: null, error };

    const grouped = new Map();
    for (const b of bids) {
        if (!b.products) continue;
        const pid = b.product_id;
        const existing = grouped.get(pid);
        if (!existing) {
            grouped.set(pid, {
                product_id: pid,
                product: b.products,
                bidders: new Set([b.user_id]),
                bids_count: 1,
                highest_price: b.bid_price,
                latest_bid_time: b.bid_time,
            });
        } else {
            existing.bidders.add(b.user_id);
            existing.bids_count += 1;
            if (b.bid_price > existing.highest_price) existing.highest_price = b.bid_price;
            if (b.bid_time > existing.latest_bid_time) existing.latest_bid_time = b.bid_time;
        }
    }

    const data = [...grouped.values()].map((g) => ({
        product_id: g.product_id,
        product: g.product,
        bidders_count: g.bidders.size,
        bids_count: g.bids_count,
        highest_price: g.highest_price,
        latest_bid_time: g.latest_bid_time,
    }));

    return { data, error: null };
}

export async function getBidsByProductId(productId) {
    await requireAdmin();
    const { data: bids, error } = await supabaseAdmin
        .from("bids")
        .select("id, bid_price, is_winning, bid_time, user_id, products(id, title, images_url, state, start_price)")
        .eq("product_id", productId)
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
