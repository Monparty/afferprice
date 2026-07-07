import { supabase } from "../lib/supabase/client";
import { apiPost } from "../lib/api";

export async function getProducts() {
    return supabase.from("products").select("*");
}

export async function getSellerProducts() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .in("state", ["active", "rejected"]);
}

export async function getProductsByState(state) {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("products")
        .select("*, bids(id, bid_price, user_id), auction_results(id, payment_status, winner_id, payment_due_at)")
        .eq("state", state)
        .eq("seller_id", user.id);
}

export async function getActiveProductsBidByUser() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: bidData, error: bidError } = await supabase
        .from("bids")
        .select("product_id")
        .eq("user_id", user.id);
    if (bidError) return { data: null, error: bidError };
    const productIds = [...new Set((bidData ?? []).map((b) => b.product_id))];
    if (!productIds.length) return { data: [], error: null };
    return supabase
        .from("products")
        .select("*, bids(id, bid_price, user_id), auction_results(id, payment_status, winner_id)")
        .in("id", productIds)
        .eq("state", "active")
        .neq("seller_id", user.id);
}

export async function getLostBidProductsByUser() {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: bidData, error: bidError } = await supabase
        .from("bids")
        .select("product_id")
        .eq("user_id", user.id);
    if (bidError) return { data: null, error: bidError };
    const productIds = [...new Set((bidData ?? []).map((b) => b.product_id))];
    if (!productIds.length) return { data: [], error: null };
    const { data: wonData, error: wonError } = await supabase
        .from("auction_results")
        .select("product_id")
        .eq("winner_id", user.id);
    if (wonError) return { data: null, error: wonError };
    const wonIds = new Set((wonData ?? []).map((w) => w.product_id));
    const lostCandidateIds = productIds.filter((pid) => !wonIds.has(pid));
    if (!lostCandidateIds.length) return { data: [], error: null };
    return supabase
        .from("products")
        .select("*, bids(id, bid_price, user_id)")
        .in("id", lostCandidateIds)
        .eq("state", "sold")
        .neq("seller_id", user.id);
}

// สินค้าที่ user ชนะแต่ผู้ขายยังไม่จัดส่ง (state='sold') — ถ้า seller จัดส่งแล้ว (state='order') จะย้ายไป tab การจัดส่ง
export async function getWonProductsByUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("auction_results")
        .select("id, payment_status, winner_id, final_price, payment_due_at, products!inner(*, bids(id, user_id))")
        .eq("winner_id", user.id)
        .eq("products.state", "sold");
}

export async function getWonProductCountByUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("auction_results")
        .select("id, products!inner(state)", { count: "exact", head: true })
        .eq("winner_id", user.id)
        .eq("products.state", "sold");
}

// สินค้าที่ user ชนะและผู้ขายจัดส่งแล้ว (state='order') — แสดงใน tab การจัดส่งฝั่งผู้ซื้อ
export async function getOrderProductsWonByUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("auction_results")
        .select("id, payment_status, winner_id, final_price, payment_due_at, products!inner(*, bids(id, user_id))")
        .eq("winner_id", user.id)
        .eq("products.state", "order");
}

// ปิดประมูลที่หมดเวลาแล้วแต่ state ยังค้างที่ 'active'
// (auction end ถูก trigger ฝั่ง client เท่านั้น — ถ้าไม่มีใครเปิดหน้า product detail สถานะจะค้าง)
// เรียกตอนโหลดหน้า /user/selling เพื่อ reconcile สถานะของสินค้าตัวเอง + สินค้าที่ user เคย bid
export async function endExpiredActiveAuctions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ended: 0 };
    const nowIso = new Date().toISOString();

    const { data: ownExpired } = await supabase
        .from("products")
        .select("id")
        .eq("seller_id", user.id)
        .eq("state", "active")
        .lt("auction_end_time", nowIso);

    const { data: bidRows } = await supabase.from("bids").select("product_id").eq("user_id", user.id);
    const bidIds = [...new Set((bidRows ?? []).map((b) => b.product_id))];
    let bidExpired = [];
    if (bidIds.length) {
        const { data } = await supabase
            .from("products")
            .select("id")
            .in("id", bidIds)
            .eq("state", "active")
            .lt("auction_end_time", nowIso);
        bidExpired = data ?? [];
    }

    const ids = [...new Set([...(ownExpired ?? []), ...bidExpired].map((p) => p.id))];
    if (!ids.length) return { ended: 0 };

    await Promise.all(ids.map((id) => apiPost("/api/auction/end", { productId: id }).catch(() => {})));
    return { ended: ids.length };
}

// ยกเลิกผลประมูลที่ผู้ชนะไม่ชำระเงินตามกำหนด (payment_due_at < now, ยัง pending)
// ไม่มี server cron — reconcile ตอนโหลดหน้า /user/selling ทั้งฝั่งผู้ชนะและผู้ขาย
export async function expireUnpaidWonAuctions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { expired: 0 };
    const nowIso = new Date().toISOString();

    // ฝั่งผู้ชนะ (RLS: winner อ่าน auction_results ของตัวเองได้)
    const { data: wonExpired } = await supabase
        .from("auction_results")
        .select("id")
        .eq("winner_id", user.id)
        .eq("payment_status", "pending")
        .lt("payment_due_at", nowIso);

    // ฝั่งผู้ขาย (RLS: seller อ่าน auction_results ของสินค้าตัวเองได้ผ่าน products join)
    const { data: sellerExpired } = await supabase
        .from("auction_results")
        .select("id, products!inner(seller_id)")
        .eq("products.seller_id", user.id)
        .eq("payment_status", "pending")
        .lt("payment_due_at", nowIso);

    const ids = [...new Set([...(wonExpired ?? []), ...(sellerExpired ?? [])].map((r) => r.id))];
    if (!ids.length) return { expired: 0 };

    await Promise.all(ids.map((id) => apiPost("/api/auction/expire-unpaid", { auctionResultId: id }).catch(() => {})));
    return { expired: ids.length };
}

export async function updateProductPrice(id, price) {
    return supabase.from("products").update({ start_price: price }).eq("id", id);
}

export async function upsertProduct(data) {
    return supabase.from("products").upsert(data).select("id").single();
}

export async function getProductCountByState(state) {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase.from("products").select("*", { count: "exact", head: true }).eq("state", state).eq("seller_id", user.id);
}

export async function getProductById(id) {
    return supabase.from("products").select("*").eq("id", id).single();
}

export async function getActiveProductsWithDetails() {
    return supabase
        .from("products")
        .select("*, categories(name), bids(id, bid_price, user_id)")
        .eq("state", "active")
        .gt("auction_end_time", new Date().toISOString())
        .order("auction_end_time", { ascending: true });
}

export async function getActiveAuctionProducts() {
    return supabase
        .from("products")
        .select("*, bids(id, bid_price, user_id)")
        .eq("state", "active")
        .gt("auction_end_time", new Date().toISOString())
        .order("auction_end_time", { ascending: true });
}

export async function searchProducts(query) {
    return supabase
        .from("products")
        .select("id, title, start_price, images_url")
        .eq("state", "active")
        .ilike("title", `%${query}%`)
        .limit(8);
}

export async function getFilteredProducts({ sortBy, categoryIds, priceMin, priceMax, condition } = {}) {
    let query = supabase
        .from("products")
        .select("*, categories(name), bids(id, bid_price)")
        .eq("state", "active")
        .gt("auction_end_time", new Date().toISOString());

    if (categoryIds?.length) query = query.in("category_id", categoryIds);
    if (priceMin != null) query = query.gte("start_price", priceMin);
    if (priceMax != null) query = query.lte("start_price", priceMax);
    if (condition) query = query.eq("condition", condition);

    if (sortBy === "2") query = query.order("start_price", { ascending: true });
    else if (sortBy === "3") query = query.order("start_price", { ascending: false });
    else query = query.order("auction_end_time", { ascending: true });

    return query;
}
