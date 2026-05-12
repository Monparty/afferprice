"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getProducts() {
    const { data: products, error } = await supabaseAdmin.from("products").select("*");
    if (error) return { data: null, error };

    const sellerIds = [...new Set(products.map((p) => p.seller_id).filter(Boolean))];
    const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", sellerIds);

    const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
    const data = products.map((p) => ({ ...p, profiles: profileMap[p.seller_id] || null }));
    return { data, error: null };
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
