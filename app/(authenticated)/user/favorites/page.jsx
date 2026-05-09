"use client";
import { useEffect, useState } from "react";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import CardProduct from "@/app/components/utils/CardProduct";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { getFavorites } from "@/app/services/favorites.service";

function formatTimeRemaining(endTime) {
    if (!endTime) return "--:--:--";
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return "หมดเวลา";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Page() {
    const { control, watch } = useForm({ defaultValues: { layout: "2" } });
    const layout = watch("layout");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFavorites().then(({ data }) => {
            setProducts(data || []);
            setLoading(false);
        });
    }, []);

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">สิ่งที่ฉันถูกใจ</h1>
                    <p className="text-slate-500 text-base font-normal">
                        {loading ? "กำลังโหลด..." : `คุณมีสินค้าที่ถูกใจทั้งหมด ${products.length} รายการ`}
                    </p>
                </div>
                <UseSegmented
                    control={control}
                    name="layout"
                    options={[
                        { value: "1", icon: <BarsOutlined /> },
                        { value: "2", icon: <AppstoreOutlined /> },
                    ]}
                />
            </div>
            {!loading && products.length === 0 ? (
                <p className="text-slate-400 text-center py-20">ยังไม่มีสินค้าที่ถูกใจ</p>
            ) : (
                <div
                    className={
                        layout === "1"
                            ? "grid grid-cols-1 gap-4"
                            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    }
                >
                    {products.map((p) => (
                        <CardProduct
                            key={p.id}
                            id={p.id}
                            image={p.images_url?.[0]?.url}
                            time={formatTimeRemaining(p.auction_end_time)}
                            category={p.categories?.name}
                            name={p.title}
                            price={p.start_price}
                            bid={p.bids?.length ?? 0}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default Page;
