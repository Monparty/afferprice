import { supabase } from "../lib/supabase/client";

export async function insertBid(data) {
    return supabase.from("bids").insert(data).select().single();
}

export async function getBidsByProduct(productId) {
    return supabase
        .from("bids")
        .select("*")
        .eq("product_id", productId)
        .order("bid_time", { ascending: false });
}

export async function getMyActiveBids() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("bids")
        .select("id, bid_price, is_winning, bid_time, product_id, products(id, title, images_url, auction_end_time, state)")
        .eq("user_id", user.id)
        .order("bid_time", { ascending: false });
}

export async function getMyWonAuctionsCount() {
    const { data: { user } } = await supabase.auth.getUser();
    return supabase
        .from("auction_results")
        .select("id", { count: "exact", head: true })
        .eq("winner_id", user.id);
}

export async function getMyFavoritesCount() {
    return supabase
        .from("favorites")
        .select("id", { count: "exact", head: true });
}

export async function getHighestBid(productId) {
    return supabase
        .from("bids")
        .select("bid_price, user_id")
        .eq("product_id", productId)
        .order("bid_price", { ascending: false })
        .limit(1)
        .single();
}

// channel `bid-{productId}` แบบรวมศูนย์ — realtime-js reuse channel instance เดิมเมื่อ topic ซ้ำ
// ถ้าแต่ละ component สร้าง/removeChannel เองตรง ๆ ตัวที่ unmount ก่อน (เช่นการ์ดใบอื่นของสินค้าเดียวกัน)
// จะฆ่า channel ที่ตัวอื่นยังฟังอยู่ → ราคา realtime ค้างจนต้อง reload (บั๊กเดียวกับ subscribeWallet)
const bidChannels = new Map(); // productId -> { ch, listeners, removeTimer }

export function subscribeBidChannel(productId, onNewBid) {
    let entry = bidChannels.get(productId);
    if (entry?.removeTimer) {
        clearTimeout(entry.removeTimer);
        entry.removeTimer = null;
    }
    if (!entry) {
        const listeners = new Set();
        const ch = supabase
            .channel(`bid-${productId}`)
            .on("broadcast", { event: "new_bid" }, ({ payload }) => listeners.forEach((fn) => fn(payload)))
            .subscribe();
        entry = { ch, listeners, removeTimer: null };
        bidChannels.set(productId, entry);
    }
    entry.listeners.add(onNewBid);
    return () => {
        entry.listeners.delete(onNewBid);
        if (entry.listeners.size > 0 || entry.removeTimer || bidChannels.get(productId) !== entry) return;
        // หน่วงก่อนถอด channel จริง — กัน remove แล้วสร้าง topic เดิมซ้ำทันที (จะได้ instance เก่าที่กำลังตาย)
        entry.removeTimer = setTimeout(() => {
            bidChannels.delete(productId);
            supabase.removeChannel(entry.ch);
        }, 1000);
    };
}

// ยิง new_bid ผ่าน channel ที่ subscribe อยู่ (ผู้ส่งไม่ได้รับ event ตัวเอง — call site set state เองอยู่แล้ว)
export function sendBidBroadcast(productId, payload) {
    bidChannels.get(productId)?.ch.send({ type: "broadcast", event: "new_bid", payload });
}
