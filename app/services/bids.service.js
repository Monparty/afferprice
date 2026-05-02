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

export async function getHighestBid(productId) {
    return supabase
        .from("bids")
        .select("bid_price")
        .eq("product_id", productId)
        .order("bid_price", { ascending: false })
        .limit(1)
        .single();
}
