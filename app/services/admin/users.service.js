"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function createAuthUser(data) {
    await requireAdmin();
    return supabaseAdmin.auth.admin.createUser(data);
}

export async function upsertProfile(data) {
    await requireAdmin();
    return supabaseAdmin.from("profiles").upsert(data);
}

export async function deleteAuthUser(id) {
    await requireAdmin();
    return supabaseAdmin.auth.admin.deleteUser(id);
}

export async function getUsersFull() {
    await requireAdmin();
    return supabaseAdmin.from("users_full").select("*");
}

export async function getUserById(id) {
    await requireAdmin();
    return supabaseAdmin.from("users_full").select("*").eq("id", id).single();
}
