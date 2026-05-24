import "server-only";

// In-memory sliding-window rate limiter.
// ⚠️ Works ต่อ instance — Vercel serverless รัน multi-instance ทำให้ effective limit สูงกว่าค่าตั้งจริง
// สำหรับ production scale ใหญ่ → ใช้ Upstash Ratelimit / Vercel KV แทน

const buckets = new Map();
const SWEEP_EVERY = 60_000;
let lastSweep = Date.now();

function sweep(now) {
    if (now - lastSweep < SWEEP_EVERY) return;
    lastSweep = now;
    for (const [k, arr] of buckets) {
        const live = arr.filter((t) => now - t < 3_600_000);
        if (live.length === 0) buckets.delete(k);
        else buckets.set(k, live);
    }
}

export function rateLimit({ key, limit, windowMs }) {
    const now = Date.now();
    sweep(now);
    const cutoff = now - windowMs;
    const arr = (buckets.get(key) || []).filter((t) => t > cutoff);
    if (arr.length >= limit) {
        return { ok: false, retryAfter: Math.ceil((arr[0] + windowMs - now) / 1000) };
    }
    arr.push(now);
    buckets.set(key, arr);
    return { ok: true, remaining: limit - arr.length };
}

export function clientKey(req, suffix = "") {
    const fwd = req.headers.get("x-forwarded-for") || "";
    const ip = fwd.split(",")[0].trim() || "unknown";
    return `${ip}:${suffix}`;
}
