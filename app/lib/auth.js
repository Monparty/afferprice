import "server-only";
import { createSupabaseServerClient } from "./supabase/server";
import { supabaseAdmin } from "./supabase/admin";

export class AuthError extends Error {
    constructor(message, status = 401) {
        super(message);
        this.name = "AuthError";
        this.status = status;
    }
}

export async function requireUser() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AuthError("unauthorized", 401);
    return user;
}

export async function requireAdmin() {
    const user = await requireUser();
    const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
    if (profile?.role !== "admin") throw new AuthError("forbidden", 403);
    return user;
}
