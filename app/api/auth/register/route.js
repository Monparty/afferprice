import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { id, first_name, last_name, phone, gender } = await request.json();

    const { error } = await supabaseAdmin.from("profiles").insert({
        id,
        first_name,
        last_name,
        phone,
        gender,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
}
