"use server";
import { supabaseAdmin } from "../../lib/supabase/admin";

export async function createAuthUser({ email, password, displayName }) {
    return supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // ยืนยันให้เลยตั้งแต่อสร้าง
        user_metadata: {
            display_name: displayName,
        },
    });
}

export async function createProfile({ id, phone, firstName, lastName, gender, birthDate, role, status }) {
    return supabaseAdmin.from("profiles").upsert({
        // เพิ่มอายุ แก้ที่ view sql ด้วย
        id: id,
        phone: phone,
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        birth_date: birthDate,
        role: role,
        status: status,
    });
}

export async function deleteAuthUser(id) {
    return supabaseAdmin.auth.admin.deleteUser(id);
}

export async function getUsersFull() {
    return supabaseAdmin.from("users_full").select("*");
}

export async function getUsersById(id) {
    return supabaseAdmin.from("users_full").select("*").eq("id", id).single();
}
