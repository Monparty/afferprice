"use server";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser } from "@/app/lib/auth";

// ค่าจัดส่งตามรูปแบบ — source of truth ฝั่ง server (ต้องตรงกับ SHIPPING_OPTIONS ใน checkout page ฝั่ง display)
export const SHIPPING_FEES = { express: 80, standard: 40, pickup: 0 };

// ผู้ซื้อ (winner) บันทึกที่อยู่ + รูปแบบจัดส่งที่เลือกลง auction_results ก่อนไปหน้าชำระเงิน
// user-gated: verify winner_id === user.id; ค่าจัดส่งคำนวณ server-side จาก SHIPPING_FEES (ไม่รับจาก client)
export async function saveCheckoutShipping(auctionResultId, addressId, shippingOption) {
    const user = await requireUser();
    if (!auctionResultId) return { error: "missing_params" };

    const { data: result, error } = await supabaseAdmin
        .from("auction_results")
        .select("id, winner_id, payment_status")
        .eq("id", auctionResultId)
        .single();
    if (error || !result) return { error: "auction_result_not_found" };
    if (result.winner_id !== user.id) return { error: "forbidden" };
    if (result.payment_status === "paid") return { error: "already_paid" };

    // ตรวจว่า address เป็นของ winner จริง (กันส่ง address_id ของคนอื่น)
    if (addressId) {
        const { data: addr } = await supabaseAdmin
            .from("user_addresses")
            .select("id")
            .eq("id", addressId)
            .eq("user_id", user.id)
            .maybeSingle();
        if (!addr) return { error: "invalid_address" };
    }

    const fee = SHIPPING_FEES[shippingOption] ?? 0;
    const { error: updErr } = await supabaseAdmin
        .from("auction_results")
        .update({ address_id: addressId ?? null, shipping_option: shippingOption ?? null, shipping_fee: fee })
        .eq("id", auctionResultId);
    if (updErr) return { error: updErr.message };

    return { data: { shipping_fee: fee } };
}

// ผู้ขายดูที่อยู่จัดส่งของผู้ซื้อ (winner) เพื่อเตรียมจัดส่ง
// RLS "user manage own address" บล็อก seller อ่าน address คนอื่น → ต้อง bypass ผ่าน supabaseAdmin + verify ownership เอง
// ใช้ address_id ที่ผู้ซื้อเลือกตอน checkout (persist แล้ว) ก่อน; fallback เป็น default ถ้าไม่มี
export async function getBuyerShippingAddress(auctionResultId) {
    const user = await requireUser();
    if (!auctionResultId) return { error: "missing_params" };

    const { data: result, error } = await supabaseAdmin
        .from("auction_results")
        .select("winner_id, address_id, products(seller_id)")
        .eq("id", auctionResultId)
        .single();
    if (error || !result) return { error: "auction_result_not_found" };
    if (result.products?.seller_id !== user.id) return { error: "forbidden" };

    // ที่อยู่ที่ผู้ซื้อเลือกไว้ตอน checkout
    if (result.address_id) {
        const { data: chosen } = await supabaseAdmin
            .from("user_addresses")
            .select("*")
            .eq("id", result.address_id)
            .maybeSingle();
        if (chosen) return { data: chosen };
    }

    // fallback: default ของ winner
    const { data: addresses } = await supabaseAdmin
        .from("user_addresses")
        .select("*")
        .eq("user_id", result.winner_id)
        .order("is_default", { ascending: false })
        .limit(1);

    return { data: addresses?.[0] ?? null };
}
