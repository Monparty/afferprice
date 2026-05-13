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

    const stateConfig = [
        { key: "draft", label: "บันทึกร่าง" },
        { key: "pending_review", label: "รออนุมัติ" },
        { key: "rejected", label: "ไม่อนุมัติ" },
        { key: "active", label: "กำลังประมูล" },
        { key: "sold", label: "มีผู้ชนะ" },
        { key: "won", label: "สินค้าที่ฉันชนะ" },
        { key: "order", label: "การจัดส่ง" },
        { key: "cancelled", label: "ยกเลิก" },
    ];
    const sellerStateKeys = stateConfig.filter((s) => s.key !== "won").map((s) => s.key);

    useEffect(() => {
        const onGetProducts = async () => {
            if (activeTab === "won") {
                const { data, error } = await getWonProductsByUser();
                if (error) return notifyError(error);
                setProducts(data ?? []);
            } else {
                const { data, error } = await getProductsByState(activeTab);
                if (error) return notifyError(error);
                setProducts(data ?? []);
            }
        };
        onGetProducts();
    }, [activeTab]);

    useEffect(() => {
        const onGetCounts = async () => {
            const counts = {};
            for (const s of sellerStateKeys) {
                const { count } = await getProductCountByState(s);
                counts[s] = count;
            }
            const { count: wonCount } = await getWonProductCountByUser();
            counts["won"] = wonCount;
            setCountState(counts);
            setLoading(false);
        };
        onGetCounts();
    }, []);

    const renderProducts = () => {
        if (!products || products.length === 0) return <UseEmpty />;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((item) => {
                    const isWonTab = activeTab === "won";
                    const productData = isWonTab ? item.products : item;
                    const auctionResult = isWonTab ? item : item.auction_results?.[0];
                    const { name, color } = mapProductState(productData?.state);
                    return (
                        <CardSellingProduct
                            key={productData?.id}
                            value={{
                                id: productData?.id,
                                stateName: isWonTab ? "สินค้าที่ฉันชนะ" : name,
                                stateColor: isWonTab ? "orange" : color,
                                start_price: productData?.start_price,
                                title: productData?.title,
                                duration_days: productData?.duration_days,
                                images_url: productData?.images_url,
                                paymentStatus: auctionResult?.payment_status,
                                isBuyer: isWonTab,
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
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
                        รายการสินค้าของฉัน
                    </h1>
                    <p className="text-slate-500 text-base font-normal">
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
