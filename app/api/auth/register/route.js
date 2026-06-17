import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { NextResponse } from "next/server";

const ALLOWED_GENDERS = new Set(["M", "F", "O"]);
const PHONE_RE = /^0[0-9]{9}$/;
const NAME_MAX = 80;

export async function POST(request) {
    try {
        const rl = rateLimit({ key: clientKey(request, "register"), limit: 5, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { first_name, last_name, phone, gender } = await request.json();

        if (typeof first_name !== "string" || !first_name.trim() || first_name.length > NAME_MAX) {
            return NextResponse.json({ error: "invalid_first_name" }, { status: 400 });
        }
        if (typeof last_name !== "string" || !last_name.trim() || last_name.length > NAME_MAX) {
            return NextResponse.json({ error: "invalid_last_name" }, { status: 400 });
        }
        if (typeof phone !== "string" || !PHONE_RE.test(phone)) {
            return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
        }
        if (!ALLOWED_GENDERS.has(gender)) {
            return NextResponse.json({ error: "invalid_gender" }, { status: 400 });
        }

        const { error } = await supabaseAdmin.from("profiles").upsert(
            {
                id: user.id,
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                phone,
                gender,
            },
            { onConflict: "id" },
        );

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });
        return NextResponse.json({ success: true });
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
