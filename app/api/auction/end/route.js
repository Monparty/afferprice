import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

export async function POST(request) {
    const rl = rateLimit({ key: clientKey(request, "auction-end"), limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }
    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    // 1. ตรวจ product
    const { data: product, error: productError } = await supabaseAdmin
        .from("products")
        .select("id, state, auction_end_time")
        .eq("id", productId)
        .single();

    if (productError || !product) return NextResponse.json({ error: "product not found" }, { status: 404 });
    if (product.state !== "active") return NextResponse.json({ ended: true }, { status: 200 });
    if (new Date(product.auction_end_time) > new Date()) {
        return NextResponse.json({ error: "auction not ended yet" }, { status: 400 });
    }

    // 2. Idempotency — ตรวจ auction_result ว่ามีแล้วหรือยัง
    const { data: existing } = await supabaseAdmin
        .from("auction_results")
        .select("id")
        .eq("product_id", productId)
        .maybeSingle();

    if (existing) return NextResponse.json({ ended: true }, { status: 200 });

    // 3. หา highest bid
    const { data: winningBid } = await supabaseAdmin
        .from("bids")
        .select("id, user_id, bid_price")
        .eq("product_id", productId)
        .order("bid_price", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (winningBid) {
        // 4. สร้าง auction_result — ถ้าชน UNIQUE(product_id) แปลว่ามี invocation อื่นทำอยู่พร้อมกัน → จบเลย
        const { error: insertErr } = await supabaseAdmin.from("auction_results").insert({
            product_id: productId,
            winner_id: winningBid.user_id,
            final_price: winningBid.bid_price,
        });
        if (insertErr) return NextResponse.json({ ended: true }, { status: 200 });

        // 5. set is_winning = true
        await supabaseAdmin.from("bids").update({ is_winning: true }).eq("id", winningBid.id);

        // 6. notifications สำหรับ losers (distinct user_id ยกเว้น winner)
        const { data: loserBids } = await supabaseAdmin
            .from("bids")
            .select("user_id")
            .eq("product_id", productId)
            .neq("user_id", winningBid.user_id);

        const loserIds = [...new Set((loserBids || []).map((b) => b.user_id))];

        const notifications = [
            { user_id: winningBid.user_id, type: "win", title: "คุณชนะการประมูล!", message: "ยินดีด้วย! คุณเป็นผู้ชนะการประมูล กรุณาชำระเงินเพื่อรับสินค้า" },
            ...loserIds.map((uid) => ({ user_id: uid, type: "lose", title: "การประมูลสิ้นสุด", message: "ขออภัย มีผู้อื่นชนะการประมูลนี้" })),
        ];
        await supabaseAdmin.from("notifications").insert(notifications);
    }

    // 7. จัดการเงินมัดจำ — ผู้ชนะ: mark 'applied' (หักจากยอดชำระ), ที่เหลือ: คืนเข้า wallet อัตโนมัติ
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
            console.error("[auction/end] refund_bid_deposit failed", dep.id, refundErr.message);
            continue;
        }
        await supabaseAdmin.from("notifications").insert({
            user_id: dep.user_id,
            type: "payment",
            title: "คืนเงินมัดจำแล้ว",
            message: `ระบบคืนเงินมัดจำ ฿${Number(dep.amount).toLocaleString("th-TH")} เข้ากระเป๋าเงินของคุณแล้ว`,
        });
        await supabaseAdmin
            .channel(`wallet-${dep.user_id}`)
            .send({ type: "broadcast", event: "update", payload: {} });
    }

    // 8. อัป product state
    const newState = winningBid ? "sold" : "cancelled";
    await supabaseAdmin.from("products").update({ state: newState }).eq("id", productId);

    return NextResponse.json({ ended: true, winnerId: winningBid?.user_id ?? null });
}
