import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ ok: true });
}

export async function POST(req) {
    const event = await req.json();

    if (event.key !== "charge.complete") {
        return NextResponse.json({ received: true });
    }

    const charge = event.data;

    await supabaseAdmin
        .from("payments")
        .update({
            payment_status: charge.status === "successful" ? "success" : "failed",
            paid_at: charge.status === "successful" ? new Date().toISOString() : null,
        })
        .eq("transaction_ref", charge.id);

    return NextResponse.json({ received: true });
}
