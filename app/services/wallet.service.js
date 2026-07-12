import { supabase } from "@/app/lib/supabase/client";
import { apiPostSafe } from "@/app/lib/api";

export async function getMyWalletBalance() {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null };
    return supabase.from("profiles").select("wallet_balance").eq("id", user.id).single();
}

export async function getMyTransactions({ limit = 50 } = {}) {
    return supabase
        .from("wallet_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
}

// subscription รวมศูนย์ — realtime-js reuse channel instance เดิมเมื่อ topic ซ้ำ
// ถ้าแต่ละ component สร้าง/removeChannel เองตรง ๆ ตัวที่ unmount ก่อน (เช่นหน้า /user/wallet)
// จะฆ่า channel ที่ AppHeader ยังใช้อยู่ → pill หยุดอัปเดตจนต้อง reload
let walletChannel = null;
let walletChannelUserId = null;
const walletListeners = new Set();

export function subscribeWallet(userId, onUpdate) {
    if (walletChannelUserId !== userId) {
        if (walletChannel) supabase.removeChannel(walletChannel);
        walletChannelUserId = userId;
        walletChannel = supabase
            .channel(`wallet-${userId}`)
            .on("broadcast", { event: "update" }, (p) => walletListeners.forEach((fn) => fn(p.payload)))
            .subscribe();
    }
    walletListeners.add(onUpdate);
    return () => {
        walletListeners.delete(onUpdate);
    };
}

// คำขอถอนเงินของตัวเอง (RLS "own withdrawal read")
export async function getMyWithdrawals({ limit = 20 } = {}) {
    return supabase
        .from("withdrawal_requests")
        .select("id, amount, status, bank_name, bank_account_no, admin_note, created_at, processed_at")
        .order("created_at", { ascending: false })
        .limit(limit);
}

// ขอถอนเงิน (ยอดจริง server เช็คกับ balance) → { data, error }
export async function requestWithdrawal(amount) {
    return apiPostSafe("/api/wallet/withdraw", { amount });
}
