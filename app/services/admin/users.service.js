"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";
import { requireAdmin } from "../../lib/auth";

export async function createAuthUser(data) {
    await requireAdmin();
    return supabaseAdmin.auth.admin.createUser(data);
}

export async function upsertProfile(data) {
    await requireAdmin();
    return supabaseAdmin.from("profiles").upsert(data);
}

export async function deleteAuthUser(id) {
    await requireAdmin();
    return supabaseAdmin.auth.admin.deleteUser(id);
}

export async function getUsersFull() {
    await requireAdmin();
    return supabaseAdmin.from("users_full").select("*");
}

export async function getUserById(id) {
    await requireAdmin();
    return supabaseAdmin.from("users_full").select("*").eq("id", id).single();
}

export async function approveKyc(userId) {
    await requireAdmin();
    const { error } = await supabaseAdmin
        .from("profiles")
        .update({ is_kyc: "approved", kyc_remark: null })
        .eq("id", userId);
    if (error) return { error };
    await supabaseAdmin.from("notifications").insert({
        user_id: userId,
        type: "kyc",
        title: "ผลการตรวจสอบ KYC",
        message: "ยืนยันตัวตนสำเร็จ คุณสามารถลงขายสินค้าได้แล้ว",
    });
    return { data: { is_kyc: "approved" } };
}

export async function rejectKyc(userId, remark) {
    await requireAdmin();
    const cleanRemark = (remark || "").toString().trim();
    if (!cleanRemark) return { error: { message: "missing_remark" } };
    const { error } = await supabaseAdmin
        .from("profiles")
        .update({ is_kyc: "rejected", kyc_remark: cleanRemark })
        .eq("id", userId);
    if (error) return { error };
    await supabaseAdmin.from("notifications").insert({
        user_id: userId,
        type: "kyc",
        title: "ผลการตรวจสอบ KYC",
        message: `ไม่ผ่านการตรวจสอบ: ${cleanRemark}`,
    });
    return { data: { is_kyc: "rejected" } };
}

export async function getIdCardSignedUrlAdmin(path, expiresIn = 300) {
    await requireAdmin();
    return supabaseAdmin.storage.from("id-cards").createSignedUrl(path, expiresIn);
}
