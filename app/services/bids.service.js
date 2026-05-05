import { supabase } from "../lib/supabase/client";

export async function insertBid(data) {
    return supabase.from("bids").insert(data).select().single();
}

export async function getBidsByProduct(productId) {
    return supabase
        .from("bids")
        .select("*")
        .eq("product_id", productId)
        .order("bid_time", { ascending: false });
}

export async function getMyActiveBids() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("bids")
        .select("id, bid_price, is_winning, bid_time, product_id, products(id, title, images_url, auction_end_time, state)")
        .eq("user_id", user.id)
        .order("bid_time", { ascending: false });
}

export async function getMyWonAuctionsCount() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("auction_results")
        .select("id", { count: "exact", head: true })
        .eq("winner_id", user.id);
}

export async function getMyFavoritesCount() {
    return supabase
        .from("favorites")
        .select("id", { count: "exact", head: true });
}

export async function getHighestBid(productId) {
    return supabase
        .from("bids")
        .select("bid_price")
        .eq("product_id", productId)
        .order("bid_price", { ascending: false })
        .limit(1)
        .single();
}
