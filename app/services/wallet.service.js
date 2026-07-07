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

export function subscribeWallet(userId, onUpdate) {
    const ch = supabase
        .channel(`wallet-${userId}`)
        .on("broadcast", { event: "update" }, (p) => onUpdate(p.payload))
        .subscribe();
    return () => supabase.removeChannel(ch);
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
