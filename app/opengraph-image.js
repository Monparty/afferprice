import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Afferprice — ประมูลสินค้าออนไลน์";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                {/* grid pattern overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* orange accent top bar */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background: "linear-gradient(90deg, #d4380d, #fa541c, #ff7a45)",
                    }}
                />

                {/* logo text */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: "linear-gradient(135deg, #fa541c, #d4380d)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 32,
                            fontWeight: 900,
                            color: "white",
                        }}
                    >
                        A
                    </div>
                    <span style={{ fontSize: 52, fontWeight: 900, color: "white", letterSpacing: -2 }}>
                        Afferprice
                    </span>
                </div>

                {/* tagline */}
                <div
                    style={{
                        fontSize: 28,
                        color: "rgba(255,255,255,0.75)",
                        marginBottom: 48,
                        letterSpacing: 1,
                    }}
                >
                    แหล่งรวมการประมูลสินค้าจากทั่วไทย
                </div>

                {/* stat badges */}
                <div style={{ display: "flex", gap: 24 }}>
                    {["ประมูล Real-time", "สินค้าคัดพิเศษ", "ปลอดภัย 100%"].map((label) => (
                        <div
                            key={label}
                            style={{
                                padding: "10px 24px",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 18,
                                fontWeight: 600,
                            }}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* domain */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 32,
                        color: "rgba(255,255,255,0.35)",
                        fontSize: 16,
                        letterSpacing: 2,
                    }}
                >
                    www.afferprice.com
                </div>
            </div>
        ),
        { ...size }
    );
}
