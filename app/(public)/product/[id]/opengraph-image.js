import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const alt = "สินค้าประมูล | Afferprice";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
    const { id } = params;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: product } = await supabase
        .from("products")
        .select("title, start_price, images_url, description")
        .eq("id", id)
        .single();

    const productImage = product?.images_url?.[0]?.url;
    const price = product?.start_price
        ? `฿${Number(product.start_price).toLocaleString("th-TH")}`
        : null;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    background: "#0f172a",
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* product image — left half blurred bg */}
                {productImage && (
                    <img
                        src={productImage}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.15,
                        }}
                    />
                )}

                {/* dark overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(90deg, rgba(15,23,42,0.97) 55%, rgba(15,23,42,0.6) 100%)",
                    }}
                />

                {/* product image — right side */}
                {productImage && (
                    <div
                        style={{
                            position: "absolute",
                            right: 60,
                            top: 60,
                            bottom: 60,
                            width: 460,
                            borderRadius: 24,
                            overflow: "hidden",
                            border: "2px solid rgba(255,255,255,0.1)",
                            display: "flex",
                        }}
                    >
                        <img src={productImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                )}

                {/* content — left side */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "52px 60px",
                        width: productImage ? 660 : "100%",
                    }}
                >
                    {/* brand */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #fa541c, #d4380d)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                                fontWeight: 900,
                                color: "white",
                            }}
                        >
                            A
                        </div>
                        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 20, fontWeight: 700 }}>
                            Afferprice
                        </span>
                        <div
                            style={{
                                marginLeft: 8,
                                padding: "4px 12px",
                                background: "rgba(250,84,28,0.2)",
                                border: "1px solid rgba(250,84,28,0.4)",
                                borderRadius: 999,
                                color: "#fa541c",
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >
                            กำลังประมูล
                        </div>
                    </div>

                    {/* title */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div
                            style={{
                                fontSize: product?.title?.length > 40 ? 32 : 40,
                                fontWeight: 900,
                                color: "white",
                                lineHeight: 1.2,
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {product?.title || "สินค้าประมูล"}
                        </div>

                        {price && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, fontWeight: 600, letterSpacing: 2 }}>
                                    ราคาเริ่มต้น
                                </span>
                                <span
                                    style={{
                                        fontSize: 48,
                                        fontWeight: 900,
                                        background: "linear-gradient(90deg, #fa541c, #ff7a45)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {price}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* footer */}
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 15, letterSpacing: 1 }}>
                        www.afferprice.com
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
