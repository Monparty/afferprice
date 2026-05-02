import { supabase } from "@/app/lib/supabase/client";

export async function getAuctionResult(auctionResultId) {
    return supabase
        .from("auction_results")
        .select("id, final_price, payment_status, products(title)")
        .eq("id", auctionResultId)
        .single();
}

export async function getPaymentByAuctionResult(auctionResultId) {
    return supabase
        .from("payments")
        .select("*")
        .eq("auction_result_id", auctionResultId)
        .single();
}
