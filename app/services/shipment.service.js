import { supabase } from "@/app/lib/supabase/client";

export async function createShipment({ auctionResultId, shippingCompany, trackingNumber }) {
    return supabase.from("shipments").insert({
        auction_result_id: auctionResultId,
        shipping_company: shippingCompany,
        tracking_number: trackingNumber,
        shipping_status: "preparing",
    });
}

export async function getShipmentByAuctionResult(auctionResultId) {
    return supabase
        .from("shipments")
        .select("*")
        .eq("auction_result_id", auctionResultId)
        .maybeSingle();
}
