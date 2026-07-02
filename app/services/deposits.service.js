import { supabase } from "@/app/lib/supabase/client";

// อ่านเงินมัดจำของตัวเองสำหรับสินค้านั้น (RLS "own deposit read" — เห็นเฉพาะของตัวเอง)
export async function getMyBidDeposit(productId) {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { data: null };
    return supabase
        .from("bid_deposits")
        .select("id, amount, status")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle();
}

// วางเงินมัดจำ 20% ของราคาปัจจุบัน (ยอดคำนวณฝั่ง server)
export async function placeBidDeposit(productId) {
    const res = await fetch("/api/bid/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (!res.ok) return { data: null, error: { message: data.error || "internal_error" } };
    return { data, error: null };
}
