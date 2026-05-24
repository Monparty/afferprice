"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getCategories() {
    await requireAdmin();
    return supabaseAdmin.from("categories").select("*");
}

export async function deleteCategorie(id) {
    await requireAdmin();
    return supabaseAdmin.from("categories").delete().eq("id", id);
}

export async function upsertCategorie(data) {
    await requireAdmin();
    return supabaseAdmin.from("categories").upsert(data);
}

export async function getCategorieById(id) {
    await requireAdmin();
    return supabaseAdmin.from("categories").select("*").eq("id", id).single();
}
