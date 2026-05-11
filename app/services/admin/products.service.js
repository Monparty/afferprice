"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getProducts() {
    return supabaseAdmin.from("products").select("*");
}

export async function deleteProduct(id) {
    await supabaseAdmin.from("favorites").delete().eq("product_id", id);
    return supabaseAdmin.from("products").delete().eq("id", id);
}

export async function upsertProduct(data) {
    return supabaseAdmin.from("products").upsert(data);
}

export async function getProductById(id) {
    return supabaseAdmin.from("products").select("*").eq("id", id).single();
}
