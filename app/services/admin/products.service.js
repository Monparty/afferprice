"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getProducts() {
    await requireAdmin();
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
    await requireAdmin();
    await supabaseAdmin.from("favorites").delete().eq("product_id", id);
    return supabaseAdmin.from("products").delete().eq("id", id);
}

const KYC_GATED_STATES = ["pending_review", "active"];

export async function upsertProduct(data) {
    await requireAdmin();
    if (KYC_GATED_STATES.includes(data?.state)) {
        let sellerId = data.seller_id;
        if (!sellerId && data.id) {
            const { data: existing } = await supabaseAdmin
                .from("products")
                .select("seller_id")
                .eq("id", data.id)
                .single();
            sellerId = existing?.seller_id;
        }
        if (!sellerId) return { error: { message: "missing_seller_id" } };
        const { data: seller } = await supabaseAdmin
            .from("profiles")
            .select("is_kyc")
            .eq("id", sellerId)
            .single();
        if (seller?.is_kyc !== "approved") {
            return { error: { message: "seller_kyc_not_approved" } };
        }
    }
    return supabaseAdmin.from("products").upsert(data);
}

export async function getProductById(id) {
    await requireAdmin();
    return supabaseAdmin.from("products").select("*").eq("id", id).single();
}
