import { supabase } from "../lib/supabase/client";

export async function getMyAddresses() {
    return supabase.from("user_addresses").select("*").order("is_default", { ascending: false });
}

export async function upsertAddress(data) {
    if (data.is_default) {
        await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", data.user_id);
    }
    return supabase.from("user_addresses").upsert(data).select().single();
}

export async function deleteAddress(id) {
    return supabase.from("user_addresses").delete().eq("id", id);
}

export async function setDefaultAddress(id) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id);
    return supabase.from("user_addresses").update({ is_default: true }).eq("id", id);
}
