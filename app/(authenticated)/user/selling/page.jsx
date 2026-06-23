"use client";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import CardSellingProduct from "@/app/components/utils/CardSellingProduct";
import UseEmpty from "@/app/components/utils/UseEmpty";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import {
    getProductCountByState,
    getProductsByState,
    getWonProductsByUser,
    getWonProductCountByUser,
    getActiveProductsBidByUser,
    getLostBidProductsByUser,
    getOrderProductsWonByUser,
    endExpiredActiveAuctions,
} from "@/app/services/products.service";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SellingTabs from "./components/SellingTabs";
import { mapProductState } from "@/app/utils/mapProductState";

function Page() {
    const { control } = useForm();
    const [activeTab, setActiveTab] = useState("draft");
    const [products, setProducts] = useState([]);
    const [countState, setCountState] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const stateConfig = [
        { key: "draft", label: "บันทึกร่าง" },
        { key: "pending_review", label: "รออนุมัติ" },
        { key: "rejected", label: "ไม่อนุมัติ" },
        { key: "active", label: "กำลังประมูล" },
        { key: "sold", label: "มีผู้ชนะ" },
        { key: "won", label: "สินค้าที่ฉันชนะ" },
        { key: "order", label: "การจัดส่ง" },
        { key: "cancelled", label: "ไม่สำเร็จ" },
    ];
    const sellerStateKeys = stateConfig.filter((s) => s.key !== "won").map((s) => s.key);

    // ปิดประมูลที่หมดเวลาแต่ค้างที่ active ก่อน แล้วค่อย refresh ถ้ามีการเปลี่ยนสถานะ
    useEffect(() => {
        endExpiredActiveAuctions().then(({ ended }) => {
            if (ended > 0) setRefreshKey((k) => k + 1);
        });
    }, []);

    useEffect(() => {
        const onGetProducts = async () => {
            if (activeTab === "won") {
                const { data, error } = await getWonProductsByUser();
                if (error) return notifyError(error);
                setProducts(data ?? []);
            } else if (activeTab === "active") {
                const [own, bid] = await Promise.all([getProductsByState("active"), getActiveProductsBidByUser()]);
                if (own.error) return notifyError(own.error);
                if (bid.error) return notifyError(bid.error);
                const ownTagged = (own.data ?? []).map((p) => ({ ...p, _isBidder: false }));
                const bidTagged = (bid.data ?? []).map((p) => ({ ...p, _isBidder: true }));
                const map = new Map();
                [...ownTagged, ...bidTagged].forEach((p) => map.set(p.id, p));
                setProducts([...map.values()]);
            } else if (activeTab === "cancelled") {
                const [own, lost] = await Promise.all([getProductsByState("cancelled"), getLostBidProductsByUser()]);
                if (own.error) return notifyError(own.error);
                if (lost.error) return notifyError(lost.error);
                const ownTagged = (own.data ?? []).map((p) => ({ ...p, _isLost: false }));
                const lostTagged = (lost.data ?? []).map((p) => ({ ...p, _isLost: true }));
                const map = new Map();
                [...ownTagged, ...lostTagged].forEach((p) => map.set(p.id, p));
                setProducts([...map.values()]);
            } else if (activeTab === "order") {
                // ผู้ขายที่จัดส่งแล้ว (สินค้าตัวเอง state='order') + ผู้ซื้อที่ผู้ขายจัดส่งแล้ว (สินค้าที่ชนะ state='order')
                const [own, won] = await Promise.all([getProductsByState("order"), getOrderProductsWonByUser()]);
                if (own.error) return notifyError(own.error);
                if (won.error) return notifyError(won.error);
                const ownItems = own.data ?? [];
                const buyerItems = (won.data ?? []).map((ar) => ({ ...ar, _isBuyerOrder: true }));
                const map = new Map();
                ownItems.forEach((p) => map.set(p.id, p));
                buyerItems.forEach((ar) => map.set(ar.products?.id, ar));
                setProducts([...map.values()]);
            } else {
                const { data, error } = await getProductsByState(activeTab);
                if (error) return notifyError(error);
                setProducts(data ?? []);
            }
        };
        onGetProducts();
    }, [activeTab, refreshKey]);

    useEffect(() => {
        const onGetCounts = async () => {
            const counts = {};
            for (const s of sellerStateKeys) {
                const { count } = await getProductCountByState(s);
                counts[s] = count;
            }
            const { data: bidActive } = await getActiveProductsBidByUser();
            counts["active"] = (counts["active"] ?? 0) + (bidActive?.length ?? 0);
            const { data: lostBid } = await getLostBidProductsByUser();
            counts["cancelled"] = (counts["cancelled"] ?? 0) + (lostBid?.length ?? 0);
            const { data: orderWon } = await getOrderProductsWonByUser();
            counts["order"] = (counts["order"] ?? 0) + (orderWon?.length ?? 0);
            const { count: wonCount } = await getWonProductCountByUser();
            counts["won"] = wonCount;
            setCountState(counts);
            setLoading(false);
        };
        onGetCounts();
    }, [refreshKey]);

    const renderProducts = () => {
        if (!products || products.length === 0) return <UseEmpty />;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item) => {
                    const isWonTab = activeTab === "won";
                    // buyer-shaped = auction_results row พร้อม products ซ้อน (won tab + buyer order tab)
                    const isBuyerShape = isWonTab || item._isBuyerOrder;
                    const productData = isBuyerShape ? item.products : item;
                    const auctionResult = isBuyerShape ? item : item.auction_results?.[0];
                    const { name, color } = mapProductState(productData?.state);
                    const currentPrice = isBuyerShape
                        ? auctionResult?.final_price
                        : productData?.bids?.length
                          ? Math.max(...productData.bids.map((b) => b.bid_price))
                          : productData?.start_price;
                    const biddersCount = new Set((productData?.bids ?? []).map((b) => b.user_id).filter(Boolean)).size;
                    const isLost = productData?._isLost;
                    return (
                        <CardSellingProduct
                            key={productData?.id}
                            value={{
                                id: productData?.id,
                                stateName: isWonTab ? "สินค้าที่ฉันชนะ" : isLost ? "ประมูลไม่ชนะ" : name,
                                stateColor: isWonTab ? "orange" : isLost ? "red" : color,
                                start_price: currentPrice,
                                title: productData?.title,
                                duration_days: productData?.duration_days,
                                auction_end_time: productData?.auction_end_time,
                                created_at: productData?.created_at,
                                bidders_count: biddersCount,
                                images_url: productData?.images_url,
                                paymentStatus: auctionResult?.payment_status,
                                isBuyer: isBuyerShape,
                                isBidder: productData?._isBidder,
                                isLost,
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    const tabItems = stateConfig.map((tab) => ({
        key: tab.key,
        label: (
            <div className="flex justify-center items-center gap-2 text-sm px-3">
                {tab.label}
                <UseTag label={countState?.[tab.key] || 0} color={activeTab === tab.key ? "orange" : undefined} />
            </div>
        ),
        children: renderProducts(),
    }));

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                        รายการสินค้าของฉัน
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
                        จัดการและติดตามสถานะการประมูลสินค้าทั้งหมดของคุณ
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
            <SellingTabs tabItems={tabItems} setActiveTab={setActiveTab} loading={loading} />
        </>
    );
}

export default Page;
