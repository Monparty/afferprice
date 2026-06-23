import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { requireUser, AuthError } from "@/app/lib/auth";
import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { omiseFetch } from "@/app/lib/payment/omise";
import { resolvePaymentAmount, PaymentError } from "@/app/lib/payment/resolveAmount";
import { NextResponse } from "next/server";

// redirect-based Omise sources: TrueMoney Wallet + Rabbit LINE Pay
// flow: create source → create charge (พร้อม return_uri) → คืน authorize_uri ให้ client redirect
// charge เป็น pending จนลูกค้า authorize → webhook charge.complete มาปิดงาน (ดู /api/payment/webhook)
const SOURCE_TO_METHOD = {
    truemoney: "truemoney",
    rabbit_linepay: "linepay",
};

function resolveOrigin(req) {
    return (
        req.headers.get("origin") ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        new URL(req.url).origin
    );
}

export async function POST(req) {
    try {
        const rl = rateLimit({ key: clientKey(req, "omise-source"), limit: 10, windowMs: 60_000 });
        if (!rl.ok) {
            return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
        }
        const user = await requireUser();
        const {
            sourceType,
            purpose = "auction",
            auctionResultId,
            productId,
            amount: clientAmount,
            phoneNumber,
        } = await req.json();

        const method = SOURCE_TO_METHOD[sourceType];
        if (!method) return NextResponse.json({ error: "invalid_source_type" }, { status: 400 });

        if (sourceType === "truemoney") {
            if (!/^0\d{9}$/.test(String(phoneNumber || ""))) {
                return NextResponse.json({ error: "invalid_phone_number" }, { status: 400 });
            }
        }

        const { amount, auctionResultId: resolvedArId, productId: resolvedProductId } =
            await resolvePaymentAmount({ user, purpose, auctionResultId, productId, clientAmount });

        const amountSatang = amount * 100;

        const sourceBody = { type: sourceType, amount: amountSatang, currency: "THB" };
        if (sourceType === "truemoney") sourceBody.phone_number = String(phoneNumber);
        const source = await omiseFetch("/sources", sourceBody);

        const origin = resolveOrigin(req);
        const returnUri = `${origin}/user/payment/return?purpose=${encodeURIComponent(purpose)}` +
            (resolvedProductId ? `&productId=${encodeURIComponent(resolvedProductId)}` : "") +
            (resolvedArId ? `&auctionResultId=${encodeURIComponent(resolvedArId)}` : "");

        const charge = await omiseFetch("/charges", {
            amount: amountSatang,
            currency: "THB",
            source: source.id,
            return_uri: returnUri,
        });

        const { error } = await supabaseAdmin.from("payments").insert({
            auction_result_id: resolvedArId,
            product_id: resolvedProductId,
            user_id: user.id,
            amount,
            payment_method: method,
            payment_status: "pending",
            transaction_ref: charge.id,
            purpose,
        });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        const authorizeUri = charge.authorize_uri || charge.source?.scannable_code?.image?.download_uri;
        if (!authorizeUri) return NextResponse.json({ error: "no_authorize_uri" }, { status: 502 });

        return NextResponse.json({ chargeId: charge.id, authorizeUri });
    } catch (err) {
        if (err instanceof AuthError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        if (err instanceof PaymentError) {
            return NextResponse.json({ error: err.code }, { status: err.status });
        }
        console.error("[omise-source]", err.message);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
