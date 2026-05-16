import { supabase } from "../lib/supabase/client";

export async function getProducts() {
    return supabase.from("products").select("*");
}

export async function getSellerProducts() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .in("state", ["active", "rejected"]);
}

export async function getProductsByState(state) {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("products")
        .select("*, bids(id, bid_price), auction_results(id, payment_status, winner_id)")
        .eq("state", state)
        .eq("seller_id", user.id);
}

export async function getWonProductsByUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("auction_results")
        .select("id, payment_status, winner_id, final_price, products(*)")
        .eq("winner_id", user.id);
}

export async function getWonProductCountByUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("auction_results")
        .select("*", { count: "exact", head: true })
        .eq("winner_id", user.id);
}

export async function updateProductPrice(id, price) {
    return supabase.from("products").update({ start_price: price }).eq("id", id);
}

export async function upsertProduct(data) {
    return supabase.from("products").upsert(data).select("id").single();
}

export async function getProductCountByState(state) {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase.from("products").select("*", { count: "exact", head: true }).eq("state", state).eq("seller_id", user.id);
}

export async function getProductById(id) {
    return supabase.from("products").select("*").eq("id", id).single();
}

export async function getActiveProductsWithDetails() {
    return supabase
        .from("products")
        .select("*, categories(name), bids(id, bid_price)")
        .eq("state", "active")
        .gt("auction_end_time", new Date().toISOString())
        .order("auction_end_time", { ascending: true });
}

export async function getActiveAuctionProducts() {
    return supabase
        .from("products")
        .select("*, bids(id, bid_price, user_id)")
        .eq("state", "active")
        .gt("auction_end_time", new Date().toISOString())
        .order("auction_end_time", { ascending: true });
}

export async function searchProducts(query) {
    return supabase
        .from("products")
        .select("id, title, start_price, images_url")
        .eq("state", "active")
        .ilike("title", `%${query}%`)
        .limit(8);
}

export async function getFilteredProducts({ sortBy, categoryIds, priceMin, priceMax, condition } = {}) {
    let query = supabase
        .from("products")
        .select("*, categories(name), bids(id, bid_price)")
        .eq("state", "active")
        .gt("auction_end_time", new Date().toISOString());

    if (categoryIds?.length) query = query.in("category_id", categoryIds);
    if (priceMin != null) query = query.gte("start_price", priceMin);
    if (priceMax != null) query = query.lte("start_price", priceMax);
    if (condition) query = query.eq("condition", condition);

    if (sortBy === "2") query = query.order("start_price", { ascending: true });
    else if (sortBy === "3") query = query.order("start_price", { ascending: false });
    else query = query.order("auction_end_time", { ascending: true });

    return query;
}
