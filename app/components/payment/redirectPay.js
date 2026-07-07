import { apiPost } from "@/app/lib/api";

// เรียก /api/payment/omise (TrueMoney / Rabbit LINE Pay) แล้ว redirect ไป authorize_uri ของ Omise
// body: { sourceType, purpose, amount?, productId?, auctionResultId?, phoneNumber? }
export async function startOmiseRedirect(body) {
    const data = await apiPost("/api/payment/omise", body);
    if (!data.authorizeUri) throw new Error("no_authorize_uri");
    window.location.href = data.authorizeUri;
}
