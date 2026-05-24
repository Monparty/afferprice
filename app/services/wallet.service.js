import { supabase } from "@/app/lib/supabase/client";

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
