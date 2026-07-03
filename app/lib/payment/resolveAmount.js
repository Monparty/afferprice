import "server-only";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

export const AUCTION_FEE_RATE = 0.05;
export const LISTING_FEE_RATE = 0.05;
export const DEPOSIT_RATE = 0.2;
export const TOPUP_MIN = 20;
export const TOPUP_MAX = 100000;

// เงินมัดจำของผู้ชนะ (status='applied' — mark โดย /api/auction/end) หักออกจากยอดชำระค่าประมูล
export async function getAppliedDepositAmount(userId, productId) {
    if (!userId || !productId) return 0;
    const { data } = await supabaseAdmin
        .from("bid_deposits")
        .select("amount")
        .eq("product_id", productId)
        .eq("user_id", userId)
        .eq("status", "applied")
        .maybeSingle();
    return Number(data?.amount ?? 0);
}

export class PaymentError extends Error {
    constructor(code, status = 400) {
        super(code);
        this.code = code;
        this.status = status;
    }
}

// resolve ยอดเงินฝั่ง server ตาม purpose + verify ownership/KYC/already-paid
// คืน { amount, auctionResultId, productId } (id ที่ไม่เกี่ยวกับ purpose จะเป็น null)
// ห้ามรับ amount จาก client ยกเว้น topup (clamp ช่วง)
export async function resolvePaymentAmount({ user, purpose, auctionResultId, productId, clientAmount }) {
    if (purpose === "auction") {
        if (!auctionResultId) throw new PaymentError("missing_auction_result", 400);
        const { data: result } = await supabaseAdmin
            .from("auction_results")
            .select("id, winner_id, final_price, payment_status, product_id, payment_due_at, shipping_fee")
            .eq("id", auctionResultId)
            .single();
        if (!result) throw new PaymentError("auction_result_not_found", 404);
        if (result.winner_id !== user.id) throw new PaymentError("forbidden", 403);
        if (result.payment_status === "paid") throw new PaymentError("already_paid", 409);
        if (result.payment_status === "canceled") throw new PaymentError("auction_canceled", 409);
        if (result.payment_due_at && new Date(result.payment_due_at) < new Date()) {
            throw new PaymentError("payment_expired", 409);
        }
        const finalPrice = Number(result.final_price);
        const shippingFee = Number(result.shipping_fee ?? 0);
        const deposit = await getAppliedDepositAmount(user.id, result.product_id);
        const amount = Math.max(1, Math.round(finalPrice + finalPrice * AUCTION_FEE_RATE) + shippingFee - deposit);
        return { amount, auctionResultId, productId: null };
    }

    if (purpose === "topup") {
        const n = Number(clientAmount);
        if (!Number.isFinite(n) || n < TOPUP_MIN || n > TOPUP_MAX) {
            throw new PaymentError("invalid_amount", 400);
        }
        return { amount: Math.round(n), auctionResultId: null, productId: null };
    }

    if (purpose === "listing_fee") {
        if (!productId) throw new PaymentError("missing_product_id", 400);
        const { data: product } = await supabaseAdmin
            .from("products")
            .select("id, seller_id, start_price, state")
            .eq("id", productId)
            .single();
        if (!product) throw new PaymentError("product_not_found", 404);
        if (product.seller_id !== user.id) throw new PaymentError("forbidden", 403);

        const { data: sellerProfile } = await supabaseAdmin
            .from("profiles")
            .select("is_kyc")
            .eq("id", user.id)
            .single();
        if (sellerProfile?.is_kyc !== "approved") throw new PaymentError("seller_kyc_not_approved", 403);

        const { data: existing } = await supabaseAdmin
            .from("payments")
            .select("id")
            .eq("product_id", productId)
            .eq("purpose", "listing_fee")
            .eq("payment_status", "success")
            .maybeSingle();
        if (existing) throw new PaymentError("already_paid", 409);

        const startPrice = Number(product.start_price);
        if (!Number.isFinite(startPrice) || startPrice <= 0) throw new PaymentError("invalid_start_price", 400);
        const amount = Math.max(1, Math.round(startPrice * LISTING_FEE_RATE));
        return { amount, auctionResultId: null, productId };
    }

    throw new PaymentError("invalid_purpose", 400);
}
