import { supabase } from "@/app/lib/supabase/client";

async function getUser() {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
}

export async function getFavorites() {
    const user = await getUser();
    if (!user) return { data: [], error: null };
    const { data, error } = await supabase
        .from("favorites")
        .select("product_id, products(*, categories(name), bids(id, bid_price))")
        .eq("user_id", user.id);
    return { data: data?.map((f) => f.products).filter(Boolean) ?? [], error };
}

export async function addFavorite(productId) {
    const user = await getUser();
    return supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
}

export async function removeFavorite(productId) {
    const user = await getUser();
    return supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
}

export async function checkIsFavorite(productId) {
    const user = await getUser();
    if (!user) return false;
    const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();
    return !!data;
}
