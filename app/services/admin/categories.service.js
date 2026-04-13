"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function getCategories() {
    return supabaseAdmin.from("categories").select("*");
}

export async function deleteCategorie(id) {
    return supabaseAdmin.from("categories").delete().eq("id", id);
}

export async function upsertCategorie(data) {
    return supabaseAdmin.from("categories").upsert(data);
}

export async function getCategorieById(id) {
    return supabaseAdmin.from("categories").select("*").eq("id", id).single();
}
