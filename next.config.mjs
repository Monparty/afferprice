const SUPABASE_HOST = "https://auiowkhqygdswdkexrip.supabase.co";
const SUPABASE_WS = "wss://auiowkhqygdswdkexrip.supabase.co";

const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.omise.co`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${SUPABASE_HOST} https://picsum.photos`,
    `media-src 'self' blob: data: ${SUPABASE_HOST}`,
    "font-src 'self' data:",
    `connect-src 'self' ${SUPABASE_HOST} ${SUPABASE_WS} https://*.omise.co`,
    "frame-src 'self' https://*.omise.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "auiowkhqygdswdkexrip.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "Content-Security-Policy", value: csp },
                    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "X-Frame-Options", value: "DENY" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                    { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
                ],
            },
        ];
    },
};

export default nextConfig;
