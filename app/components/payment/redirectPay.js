// เรียก /api/payment/omise (TrueMoney / Rabbit LINE Pay) แล้ว redirect ไป authorize_uri ของ Omise
// body: { sourceType, purpose, amount?, productId?, auctionResultId?, phoneNumber? }
export async function startOmiseRedirect(body) {
    const res = await fetch("/api/payment/omise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.authorizeUri) {
        throw new Error(data?.error || "เกิดข้อผิดพลาด");
    }
    window.location.href = data.authorizeUri;
}
