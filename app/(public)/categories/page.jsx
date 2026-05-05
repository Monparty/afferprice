"use client";
import { useCallback, useEffect, useState } from "react";
import CardHighlight from "@/app/components/utils/CardHighlight";
import DetailSearchBox from "@/app/components/utils/DetailSearchBox";
import UsePagination from "@/app/components/utils/UsePagination";
import { getActiveProductsWithDetails, getFilteredProducts } from "@/app/services/products.service";
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

function Page() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadProducts = useCallback(async (filters) => {
        setLoading(true);
        const { data } = filters ? await getFilteredProducts(filters) : await getActiveProductsWithDetails();
        let result = data || [];

        if (filters?.sortBy === "1") {
            result = [...result].sort((a, b) => (b.bids?.length ?? 0) - (a.bids?.length ?? 0));
        }
        if (filters?.timeMaxHours) {
            const maxMs = filters.timeMaxHours * 3600000;
            result = result.filter((p) => {
                const diff = new Date(p.auction_end_time) - new Date();
                return diff > 0 && diff <= maxMs;
            });
        }

        setProducts(result);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadProducts(null);
    }, [loadProducts]);

    return (
        <main className="flex gap-6">
            <div className="h-fit w-1/4 sticky top-12">
                <DetailSearchBox onSearch={loadProducts} />
            </div>
            <div className="w-full">
                {loading ? (
                    <CardSkeleton />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((p) => (
                                <CardHighlight
                                    key={p.id}
                                    id={p.id}
                                    image={p.images_url?.[0]?.url}
                                    time={formatTimeRemaining(p.auction_end_time)}
                                    category={p.categories?.name}
                                    name={p.title}
                                    price={p.start_price}
                                    bidCount={p.bids?.length}
                                />
                            ))}
                        </div>
                        <div className="mt-12">
                            <UsePagination />
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Page;
