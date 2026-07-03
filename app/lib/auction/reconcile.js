import "server-only";
import { supabaseAdmin } from "@/app/lib/supabase/admin";

const PAYMENT_DUE_DAYS = 3;

// คืนเงินค่าประกันการขาย (listing fee) ให้ผู้ขายเมื่อการขายไม่สำเร็จ — idempotent ใน RPC
async function refundListingFee(productId) {
    const { data, error } = await supabaseAdmin.rpc("refund_listing_fee", { p_product_id: productId });
    if (error) {
        console.error("[reconcile] refund_listing_fee failed", productId, error.message);
        return;
    }
    if (!data?.refunded) return;
    await supabaseAdmin.from("notifications").insert({
        user_id: data.seller_id,
        type: "payment",
        title: "คืนเงินค่าประกันการขายแล้ว",
        message: `การขายไม่สำเร็จ ระบบคืนเงินค่าประกันการขาย ฿${Number(data.amount).toLocaleString("th-TH")} เข้ากระเป๋าเงินของคุณแล้ว`,
    });
    await supabaseAdmin.channel(`wallet-${data.seller_id}`).send({ type: "broadcast", event: "update", payload: {} });
}

// ปิดประมูล 1 รายการ (idempotent) — logic เดียวกับที่ /api/auction/end ใช้; ใช้ร่วมกันโดย route + cron
export async function endAuction(productId) {
    const { data: product } = await supabaseAdmin
        .from("products")
        .select("id, state, auction_end_time")
        .eq("id", productId)
        .single();

    if (!product) return { error: "product_not_found", status: 404 };
    if (product.state !== "active") return { ended: true };
    if (new Date(product.auction_end_time) > new Date()) return { error: "auction_not_ended", status: 400 };

    // Idempotency — มี auction_result แล้ว → จบ
    const { data: existing } = await supabaseAdmin
        .from("auction_results")
        .select("id")
        .eq("product_id", productId)
        .maybeSingle();
    if (existing) return { ended: true };

    const { data: winningBid } = await supabaseAdmin
        .from("bids")
        .select("id, user_id, bid_price")
        .eq("product_id", productId)
        .order("bid_price", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (winningBid) {
        // ผู้ชนะมีเวลาชำระเงิน 3 วัน; เกินกำหนดจะถูกริบมัดจำ (ดู expire_unpaid_auction)
        const paymentDueAt = new Date(Date.now() + PAYMENT_DUE_DAYS * 24 * 60 * 60 * 1000).toISOString();

        // ถ้าชน UNIQUE(product_id) แปลว่ามี invocation อื่นทำอยู่พร้อมกัน → จบเลย
        const { error: insertErr } = await supabaseAdmin.from("auction_results").insert({
            product_id: productId,
            winner_id: winningBid.user_id,
            final_price: winningBid.bid_price,
            payment_due_at: paymentDueAt,
        });
        if (insertErr) return { ended: true };

        await supabaseAdmin.from("bids").update({ is_winning: true }).eq("id", winningBid.id);

        const { data: loserBids } = await supabaseAdmin
            .from("bids")
            .select("user_id")
            .eq("product_id", productId)
            .neq("user_id", winningBid.user_id);
        const loserIds = [...new Set((loserBids || []).map((b) => b.user_id))];

        await supabaseAdmin.from("notifications").insert([
            { user_id: winningBid.user_id, type: "win", title: "คุณชนะการประมูล!", message: "ยินดีด้วย! คุณเป็นผู้ชนะการประมูล กรุณาชำระเงินเพื่อรับสินค้า" },
            ...loserIds.map((uid) => ({ user_id: uid, type: "lose", title: "การประมูลสิ้นสุด", message: "ขออภัย มีผู้อื่นชนะการประมูลนี้" })),
        ]);
    }

    // จัดการเงินมัดจำ — ผู้ชนะ mark 'applied', ที่เหลือ refund เข้า wallet
    const { data: heldDeposits } = await supabaseAdmin
        .from("bid_deposits")
        .select("id, user_id, amount")
        .eq("product_id", productId)
        .eq("status", "held");

    for (const dep of heldDeposits || []) {
        if (winningBid && dep.user_id === winningBid.user_id) {
            await supabaseAdmin.from("bid_deposits").update({ status: "applied" }).eq("id", dep.id);
            continue;
        }
        const { error: refundErr } = await supabaseAdmin.rpc("refund_bid_deposit", { p_deposit_id: dep.id });
        if (refundErr) {
            console.error("[reconcile] refund_bid_deposit failed", dep.id, refundErr.message);
            continue;
        }
        await supabaseAdmin.from("notifications").insert({
            user_id: dep.user_id,
            type: "payment",
            title: "คืนเงินมัดจำแล้ว",
            message: `ระบบคืนเงินมัดจำ ฿${Number(dep.amount).toLocaleString("th-TH")} เข้ากระเป๋าเงินของคุณแล้ว`,
        });
        await supabaseAdmin.channel(`wallet-${dep.user_id}`).send({ type: "broadcast", event: "update", payload: {} });
    }

    const newState = winningBid ? "sold" : "cancelled";
    await supabaseAdmin.from("products").update({ state: newState }).eq("id", productId);

    // ไม่มีคน bid → การขายไม่สำเร็จ → คืนเงินค่าประกันการขายให้ผู้ขาย
    if (!winningBid) await refundListingFee(productId);

    return { ended: true, winnerId: winningBid?.user_id ?? null };
}

// ยกเลิกผลประมูลที่ผู้ชนะไม่จ่ายตามกำหนด (1 รายการ) — logic เดียวกับ /api/auction/expire-unpaid
export async function expireUnpaidAuction(auctionResultId) {
    const { data, error } = await supabaseAdmin.rpc("expire_unpaid_auction", { p_auction_result_id: auctionResultId });
    if (error) {
        console.error("[reconcile] expire_unpaid_auction failed", auctionResultId, error.message);
        return { error: error.message, status: 400 };
    }

    if (data?.expired) {
        const depositAmount = Number(data.deposit_amount || 0);
        const sellerComp = Number(data.seller_compensation || 0);
        const amountText = depositAmount.toLocaleString("th-TH");
        const compText = sellerComp.toLocaleString("th-TH");
        const notifications = [
            {
                user_id: data.winner_id,
                type: "payment",
                title: "หมดเวลาชำระเงิน",
                message: `คุณไม่ได้ชำระค่าประมูลภายในกำหนด ระบบยกเลิกรายการและริบเงินมัดจำ ฿${amountText}`,
            },
        ];
        if (data.seller_id) {
            notifications.push({
                user_id: data.seller_id,
                type: "payment",
                title: "ผู้ซื้อไม่ชำระเงิน",
                message:
                    sellerComp > 0
                        ? `ผู้ชนะไม่ชำระค่าประมูลภายในกำหนด รายการถูกยกเลิก ระบบโอนค่าชดเชย ฿${compText} (ส่วนแบ่ง 5% จากเงินมัดจำผู้ซื้อ) เข้ากระเป๋าเงินของคุณ`
                        : "ผู้ชนะไม่ได้ชำระค่าประมูลภายในกำหนด รายการถูกยกเลิก",
            });
        }
        await supabaseAdmin.from("notifications").insert(notifications);

        if (data.seller_id && sellerComp > 0) {
            await supabaseAdmin.channel(`wallet-${data.seller_id}`).send({ type: "broadcast", event: "update", payload: {} });
        }

        // ผู้ชนะไม่จ่าย → การขายไม่สำเร็จ → คืนเงินค่าประกันการขายให้ผู้ขาย
        if (data.product_id) await refundListingFee(data.product_id);
    }

    return data;
}

// reconcile ทั้งระบบ (server-side) — เรียกจาก cron endpoint แทนการพึ่ง client เปิดหน้า /user/selling
export async function reconcileAll() {
    const nowIso = new Date().toISOString();

    const { data: expiredActive } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("state", "active")
        .lt("auction_end_time", nowIso);
    for (const p of expiredActive || []) await endAuction(p.id);

    const { data: overdue } = await supabaseAdmin
        .from("auction_results")
        .select("id")
        .eq("payment_status", "pending")
        .lt("payment_due_at", nowIso);
    for (const r of overdue || []) await expireUnpaidAuction(r.id);

    return { endedCount: expiredActive?.length || 0, expiredCount: overdue?.length || 0 };
}
