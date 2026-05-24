import { supabase } from "@/app/lib/supabase/client";

export async function getAuctionResultByProduct(productId) {
    return supabase
        .from("auction_results")
        .select("id, final_price, payment_status, products(title, images_url, seller_id)")
        .eq("product_id", productId)
        .maybeSingle();
}

export async function getAuctionResultById(id) {
    return supabase
        .from("auction_results")
        .select("id, final_price, payment_status, products(title, images_url)")
        .eq("id", id)
        .maybeSingle();
}

export async function getPaymentByAuctionResult(auctionResultId) {
    return supabase
        .from("payments")
        .select("*")
        .eq("auction_result_id", auctionResultId)
        .single();
}

export async function createMockPayment({ auctionResultId, userId, amount, method }) {
    return supabase.from("payments").insert({
        auction_result_id: auctionResultId,
        user_id: userId,
        amount,
        payment_method: method,
        payment_status: "pending",
        transaction_ref: `MOCK-${method.toUpperCase()}-${Date.now()}`,
    });
}
