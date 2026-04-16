import { supabase } from "../lib/supabase/client";

export async function upsertProduct(data) {
    return supabase.from("products").upsert(data).select("id").single();
}

export async function getProductsByState(state) {
    return supabase.from("products").select("*").eq("state", state);
}

export async function getProductById(id) {
    return supabase.from("products").select("*").eq("id", id).single();
}
