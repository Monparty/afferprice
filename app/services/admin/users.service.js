"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function createAuthUser(data) {
    return supabaseAdmin.auth.admin.createUser(data);
}

export async function upsertProfile(data) {
    return supabaseAdmin.from("profiles").upsert(data);
}

export async function deleteAuthUser(id) {
    return supabaseAdmin.auth.admin.deleteUser(id);
}

export async function getUsersFull() {
    return supabaseAdmin.from("users_full").select("*");
}

export async function getUserById(id) {
    return supabaseAdmin.from("users_full").select("*").eq("id", id).single();
}
