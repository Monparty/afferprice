"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getAllBids() {
    await requireAdmin();
    const { data: bids, error } = await supabaseAdmin
        .from("bids")
        .select("id, bid_price, is_winning, bid_time, user_id, products(title, images_url)")
        .order("bid_time", { ascending: false });

    if (error) return { data: null, error };

    const userIds = [...new Set(bids.map((b) => b.user_id))];
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const data = bids.map((b) => ({ ...b, profile: userMap[b.user_id] ?? null }));

    return { data, error: null };
}

export async function getBidsGroupedByProduct() {
    await requireAdmin();
    const { data: bids, error } = await supabaseAdmin
        .from("bids")
        .select("id, bid_price, bid_time, user_id, product_id, products(id, title, images_url, state, start_price, auction_end_time)")
        .order("bid_time", { ascending: false });

    if (error) return { data: null, error };

    const grouped = new Map();
    for (const b of bids) {
        if (!b.products) continue;
        const pid = b.product_id;
        const existing = grouped.get(pid);
        if (!existing) {
            grouped.set(pid, {
                product_id: pid,
                product: b.products,
                bidders: new Set([b.user_id]),
                bids_count: 1,
                highest_price: b.bid_price,
                latest_bid_time: b.bid_time,
            });
        } else {
            existing.bidders.add(b.user_id);
            existing.bids_count += 1;
            if (b.bid_price > existing.highest_price) existing.highest_price = b.bid_price;
            if (b.bid_time > existing.latest_bid_time) existing.latest_bid_time = b.bid_time;
        }
    }

    const data = [...grouped.values()].map((g) => ({
        product_id: g.product_id,
        product: g.product,
        bidders_count: g.bidders.size,
        bids_count: g.bids_count,
        highest_price: g.highest_price,
        latest_bid_time: g.latest_bid_time,
    }));

    return { data, error: null };
}

export async function getSoldOrderDetail(productId) {
    await requireAdmin();

    const { data: product, error: pErr } = await supabaseAdmin
        .from("products")
        .select("id, title, state, seller_id")
        .eq("id", productId)
        .single();
    if (pErr) return { data: null, error: pErr };
    // แสดงข้อมูลผู้ซื้อ/ผู้ขาย เฉพาะประมูลที่จบแล้วมีผู้ชนะ (sold หรือจัดส่งแล้ว order)
    if (!["sold", "order"].includes(product.state)) return { data: null, error: null };

    const { data: result, error: rErr } = await supabaseAdmin
        .from("auction_results")
        .select("id, final_price, payment_status, winner_id, address_id, shipping_option, shipping_fee")
        .eq("product_id", productId)
        .maybeSingle();
    if (rErr) return { data: null, error: rErr };

    const ids = [product.seller_id, result?.winner_id].filter(Boolean);
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email, phone, address, bank_name, bank_account_no, bank_account_name")
        .in("id", ids);
    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));

    let buyerAddress = null;
    if (result?.address_id) {
        // ที่อยู่ที่ผู้ซื้อเลือกไว้ตอน checkout (persist แล้ว)
        const { data: chosen } = await supabaseAdmin
            .from("user_addresses")
            .select("*")
            .eq("id", result.address_id)
            .maybeSingle();
        buyerAddress = chosen ?? null;
    }
    if (!buyerAddress && result?.winner_id) {
        // fallback: default ของ winner
        const { data: addrs } = await supabaseAdmin
            .from("user_addresses")
            .select("*")
            .eq("user_id", result.winner_id)
            .order("is_default", { ascending: false });
        buyerAddress = addrs?.find((a) => a.is_default) ?? addrs?.[0] ?? null;
    }

    let shipment = null;
    if (result?.id) {
        const { data: ship } = await supabaseAdmin
            .from("shipments")
            .select("shipping_company, tracking_number, shipping_status, created_at")
            .eq("auction_result_id", result.id)
            .maybeSingle();
        shipment = ship ?? null;
    }

    return {
        data: {
            seller: userMap[product.seller_id] ?? null,
            buyer: result?.winner_id ? userMap[result.winner_id] ?? null : null,
            buyerAddress,
            result,
            shipment,
        },
        error: null,
    };
}

export async function getBidsByProductId(productId) {
    await requireAdmin();
    const { data: bids, error } = await supabaseAdmin
        .from("bids")
        .select("id, bid_price, is_winning, bid_time, user_id, products(id, title, images_url, state, start_price)")
        .eq("product_id", productId)
        .order("bid_time", { ascending: false });

    if (error) return { data: null, error };

    const userIds = [...new Set(bids.map((b) => b.user_id))];
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const data = bids.map((b) => ({ ...b, profile: userMap[b.user_id] ?? null }));

    return { data, error: null };
}
