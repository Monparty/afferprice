"use client";
import { useEffect, useState } from "react";
import UseButton from "@/app/components/inputs/UseButton";
import CardProductLive from "@/app/components/utils/CardProductLive";
import UsePagination from "@/app/components/utils/UsePagination";
import { getActiveAuctionProducts } from "@/app/services/products.service";
import UseSkeleton from "@/app/components/utils/UseSkeleton";

function formatTimeRemaining(endTime) {
    if (!endTime) return "--:--:--";
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return "หมดเวลา";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CardSkeleton() {
    return (
        <div className="grid gap-6">
            <UseSkeleton />
            <UseSkeleton />
        </div>
    );
}

function getAuctionState(endTime) {
    if (!endTime) return 1;
    const diff = new Date(endTime) - new Date();
    if (diff < 3600000) return 3;
    if (diff < 86400000) return 2;
    return 1;
}

export default function AuctionPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActiveAuctionProducts().then(({ data }) => {
            if (data) setProducts(data);
            setLoading(false);
        });
    }, []);

    return (
        <main>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-red-500 font-bold text-sm uppercase tracking-wider">
                            กำลังประมูล (Live)
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">กำลังจะจบเร็วๆ นี้</h1>
                    <p className="text-slate-500 mt-1">รีบเสนอราคาเลย! รายการเหล่านี้กำลังจะปิดการประมูลในไม่ช้า</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                    <UseButton label="จบเร็วที่สุด" size="large" />
                    <UseButton label="ยอดนิยม" type="default" size="large" />
                </div>
            </div>
            {loading ? (
                <CardSkeleton />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((p) => (
                            <CardProductLive
                                key={p.id}
                                id={p.id}
                                state={getAuctionState(p.auction_end_time)}
                                src={p.images_url?.[0]?.url || "https://picsum.photos/200/300"}
                                productName={p.title}
                                price={p.start_price}
                                items={Array(Math.min(p.bids?.length || 0, 5)).fill({ firstName: "?" })}
                                desc={`${p.bids?.length || 0} บิดทั้งหมด`}
                                time={formatTimeRemaining(p.auction_end_time)}
                            />
                        ))}
                    </div>
                    <div className="mt-12">
                        <UsePagination />
                    </div>
                </>
            )}
        </main>
    );
}
