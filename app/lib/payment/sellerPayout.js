import "server-only";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

// เครดิตเงินขาย (final_price) เข้า wallet ผู้ขายหลังผู้ซื้อชำระสำเร็จ (idempotent ผ่าน RPC)
// + broadcast wallet-{seller} + แจ้งเตือน — เรียกได้ทั้งจาก webhook (promptpay/บัตร/redirect) และ wallet/charge route
export async function settleSellerProceeds(auctionResultId) {
    if (!auctionResultId) return;
    const { data, error } = await supabaseAdmin.rpc("credit_seller_proceeds", {
        p_auction_result_id: auctionResultId,
    });
    if (error) {
        console.error("[sellerPayout] credit_seller_proceeds failed", auctionResultId, error.message);
        return;
    }
    // เครดิตแล้ว/ยังไม่ paid → ไม่ต้อง broadcast/notify ซ้ำ (idempotent)
    if (!data?.seller_id || data.already_credited || data.skipped) return;

    await supabaseAdmin
        .channel(`wallet-${data.seller_id}`)
        .send({ type: "broadcast", event: "update", payload: {} });

    await supabaseAdmin.from("notifications").insert({
        user_id: data.seller_id,
        type: "payment",
        title: "ได้รับเงินค่าขายสินค้า",
        message: `ผู้ซื้อชำระเงินแล้ว ระบบโอนเงิน ฿${Number(data.amount).toLocaleString("th-TH")} เข้ากระเป๋าเงินของคุณ`,
    });
}
