import { supabase } from "@/app/lib/supabase/client";

export async function getAuctionResultByProduct(productId) {
    return supabase
        .from("auction_results")
        .select("id, final_price, payment_status, products(title, images_url)")
        .eq("product_id", productId)
        .maybeSingle();
}

export async function getPaymentByAuctionResult(auctionResultId) {
    return supabase
        .from("payments")
        .select("*")
        .eq("auction_result_id", auctionResultId)
        .single();
}
