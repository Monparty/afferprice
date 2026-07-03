import "server-only";
import { createClient } from "@supabase/supabase-js";

// SUPABASE_INTERNAL_URL ใช้ตอนรันใน docker (server ในคอนเทนเนอร์ต้องยิง host.docker.internal
// ไม่ใช่ 127.0.0.1 ที่ browser ใช้); ไม่ตั้ง = fallback ค่าเดิม (prod/dev ปกติไม่กระทบ)
export const supabaseAdmin = createClient(
    process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);
