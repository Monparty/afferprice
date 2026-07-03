import { rateLimit, clientKey } from "@/app/lib/rateLimit";
import { endAuction } from "@/app/lib/auction/reconcile";
import { NextResponse } from "next/server";

export async function POST(request) {
    const rl = rateLimit({ key: clientKey(request, "auction-end"), limit: 30, windowMs: 60_000 });
    if (!rl.ok) {
        return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
    }
    const { productId } = await request.json();
    if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

    const result = await endAuction(productId);
    if (result?.error) {
        return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });
    }
    return NextResponse.json(result);
}
