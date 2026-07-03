"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function getWithdrawals() {
    await requireAdmin();
    const { data, error } = await supabaseAdmin
        .from("withdrawal_requests")
        .select("id, user_id, amount, status, bank_name, bank_account_no, bank_account_name, admin_note, created_at, processed_at")
        .order("created_at", { ascending: false });

    if (error) return { data: null, error };

    const userIds = [...new Set(data.map((w) => w.user_id).filter(Boolean))];
    const { data: users } = await supabaseAdmin
        .from("users_full")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

    const userMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
    const enriched = data.map((w) => ({ ...w, user: userMap[w.user_id] || null }));

    return { data: enriched, error: null };
}

// อนุมัติ (paid) / ปฏิเสธ (rejected → คืนเงิน) — RPC idempotent + แจ้งเตือนผู้ใช้ + broadcast
export async function processWithdrawal(withdrawalId, action, note = null) {
    await requireAdmin();
    if (!withdrawalId || !["paid", "rejected"].includes(action)) {
        return { error: { message: "invalid_action" } };
    }

    const { data, error } = await supabaseAdmin.rpc("process_withdrawal", {
        p_withdrawal_id: withdrawalId,
        p_action: action,
        p_note: note,
    });
    if (error) return { error };
    if (data?.already_processed) return { data };

    if (data?.user_id) {
        const amountText = Number(data.amount || 0).toLocaleString("th-TH");
        await supabaseAdmin.from("notifications").insert({
            user_id: data.user_id,
            type: "payment",
            title: action === "paid" ? "ถอนเงินสำเร็จ" : "คำขอถอนเงินถูกปฏิเสธ",
            message:
                action === "paid"
                    ? `ระบบโอนเงิน ฿${amountText} เข้าบัญชีธนาคารของคุณเรียบร้อยแล้ว`
                    : `คำขอถอนเงิน ฿${amountText} ถูกปฏิเสธ ระบบคืนเงินเข้ากระเป๋าเงินของคุณแล้ว${note ? ` (${note})` : ""}`,
        });
        // rejected คืนเงินเข้า wallet → refresh header
        if (action === "rejected") {
            await supabaseAdmin
                .channel(`wallet-${data.user_id}`)
                .send({ type: "broadcast", event: "update", payload: {} });
        }
    }

    return { data };
}
