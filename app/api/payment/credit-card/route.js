import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { omiseFetch } from "@/app/lib/payment/omise";
import { resolvePaymentAmount, PaymentError } from "@/app/lib/payment/resolveAmount";
import { NextResponse } from "next/server";

// บัตรเครดิต/เดบิต — client tokenize ผ่าน Omise.js แล้วส่ง token มา (PAN ไม่แตะ server)
// charge ตรง → insert payment เป็น pending → webhook charge.complete มาปิดเป็น success
export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "credit-card"), limit: 10, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const { amount: clientAmount, omiseToken, purpose = "topup", auctionResultId, productId } = await req.json();
        if (!omiseToken) {
            return NextResponse.json({ error: "missing_token" }, { status: 400 });
        }

        const { amount, auctionResultId: resolvedArId, productId: resolvedProductId } =
            await resolvePaymentAmount({ user, purpose, auctionResultId, productId, clientAmount });

        const charge = await omiseFetch("/charges", {
            amount: amount * 100,
            currency: "THB",
            card: omiseToken,
        });

        const { error } = await supabaseAdmin.from("payments").insert({
            auction_result_id: resolvedArId,
            product_id: resolvedProductId,
            user_id: user.id,
            amount,
            payment_method: "credit_card",
            payment_status: "pending",
            transaction_ref: charge.id,
            purpose,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ chargeId: charge.id, status: charge.status, authorizeUri: charge.authorize_uri || null });
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        if (err instanceof PaymentError) {
            return NextResponse.json({ error: err.code }, { status: err.status });
        }
        console.error("[credit-card]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
