import { supabase } from "@/app/lib/supabase/client";

export async function getAuctionResultByProduct(productId) {
    return supabase
        .from("auction_results")
        .select("id, final_price, payment_status, winner_id, products(title, images_url, seller_id)")
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

export async function getListingFeePayment(productId) {
    // success ใช้ตัดสินว่าจ่ายแล้ว — order desc ทำให้ success มาก่อน pending (alphabetical)
    return supabase
        .from("payments")
        .select("id, amount, payment_method, payment_status, paid_at")
        .eq("product_id", productId)
        .eq("purpose", "listing_fee")
        .order("payment_status", { ascending: false })
        .limit(1)
        .maybeSingle();
}
