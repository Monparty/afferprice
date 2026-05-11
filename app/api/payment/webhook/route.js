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

    const isSuccess = charge.status === "successful";

    const { data: payment } = await supabaseAdmin
        .from("payments")
        .update({
            payment_status: isSuccess ? "success" : "failed",
            paid_at: isSuccess ? new Date().toISOString() : null,
        })
        .eq("transaction_ref", charge.id)
        .select("auction_result_id")
        .single();

    if (isSuccess && payment?.auction_result_id) {
        const { data: auctionResult } = await supabaseAdmin
            .from("auction_results")
            .select("product_id")
            .eq("id", payment.auction_result_id)
            .single();

        if (auctionResult?.product_id) {
            await supabaseAdmin
                .from("products")
                .update({ state: "sold" })
                .eq("id", auctionResult.product_id);
        }
    }

    return NextResponse.json({ received: true });
}
