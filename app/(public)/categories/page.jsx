"use client";
import { useEffect, useState } from "react";
import CardHighlight from "@/app/components/utils/CardHighlight";
import DetailSearchBox from "@/app/components/utils/DetailSearchBox";
import UsePagination from "@/app/components/utils/UsePagination";
import { getActiveProductsWithDetails } from "@/app/services/products.service";

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
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getActiveProductsWithDetails().then(({ data }) => {
            if (data) setProducts(data);
        });
    }, []);

    return (
        <main className="flex gap-6">
            <div className="h-fit w-1/4 sticky top-12">
                <DetailSearchBox />
            </div>
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <CardHighlight
                            key={p.id}
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
            </div>
        </main>
    );
}

export default Page;
