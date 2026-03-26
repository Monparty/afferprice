import { supabase } from "../lib/supabase/client";

export async function upsertProduct(data) {
    return supabase.from("products").upsert(data).select("id").single();
}
