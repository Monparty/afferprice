import { supabase } from "../lib/supabase/client";

export async function upsertProduct(data) {
    return supabase.from("products").upsert(data).select("id").single();
}

export async function getProducts(status) {
    return supabase.from("products").select("*").eq("status", status);
}

export async function getProductById(id) {
    return supabase.from("products").select("*").eq("id", id).single();
}
