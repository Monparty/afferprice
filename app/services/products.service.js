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
    return supabase.from("products").select("*").eq("state", state).eq("seller_id", user.id);
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
        .select("*, categories(name), bids(id)")
        .eq("state", "active")
        .order("auction_end_time", { ascending: true });
}

export async function getActiveAuctionProducts() {
    return supabase
        .from("products")
        .select("*, bids(id, user_id)")
        .eq("state", "active")
        .order("auction_end_time", { ascending: true });
}
