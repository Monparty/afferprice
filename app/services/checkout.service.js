"use server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser } from "@/app/lib/auth";

// ผู้ขายดูที่อยู่จัดส่งของผู้ซื้อ (winner) เพื่อเตรียมจัดส่ง
// RLS "user manage own address" บล็อก seller อ่าน address คนอื่น → ต้อง bypass ผ่าน supabaseAdmin + verify ownership เอง
export async function getBuyerShippingAddress(auctionResultId) {
    const user = await requireUser();
    if (!auctionResultId) return { error: "missing_params" };

    const { data: result, error } = await supabaseAdmin
        .from("auction_results")
        .select("winner_id, products(seller_id)")
        .eq("id", auctionResultId)
        .single();
    if (error || !result) return { error: "auction_result_not_found" };
    if (result.products?.seller_id !== user.id) return { error: "forbidden" };

    const { data: addresses } = await supabaseAdmin
        .from("user_addresses")
        .select("*")
        .eq("user_id", result.winner_id)
        .order("is_default", { ascending: false })
        .limit(1);

    return { data: addresses?.[0] ?? null };
}
