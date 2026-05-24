import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId, amount, auctionResultId } = await req.json();

        if (!userId || !amount || !auctionResultId) {
            return NextResponse.json({ error: "missing_params" }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin.rpc("charge_wallet", {
            p_user_id: userId,
            p_amount: amount,
            p_auction_result_id: auctionResultId,
        });

        if (error) return NextResponse.json({ error: error.message }, { status: 400 });

        await supabaseAdmin
            .channel(`wallet-${userId}`)
            .send({ type: "broadcast", event: "update", payload: data });

        return NextResponse.json(data);
    } catch (err) {
        console.error("[wallet/charge]", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
