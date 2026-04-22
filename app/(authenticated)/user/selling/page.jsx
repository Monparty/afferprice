"use client";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import CardSellingProduct from "@/app/components/utils/CardSellingProduct";
import UseEmpty from "@/app/components/utils/UseEmpty";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getProductCountByState, getProductsByState } from "@/app/services/products.service";
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
        { key: "ended", label: "หมดเวลาประมูล" },
        { key: "sold", label: "มีผู้ชนะ" },
        { key: "cancelled", label: "ยกเลิก" },
    ];
    const stateKey = stateConfig.map((item) => item.key);

    useEffect(() => {
        const onGetProductsByState = async () => {
            const { data, error } = await getProductsByState(activeTab);
            if (error) return notifyError(error);
            setProducts(data);
        };
        onGetProductsByState();
    }, [activeTab]);

    useEffect(() => {
        if (!stateKey) return;
        const onGetProductCountByState = async () => {
            const counts = {};
            for (const s of stateKey) {
                const { count } = await getProductCountByState(s);
                counts[s] = count;
            }
            setCountState(counts);
            setLoading(false);
        };
        onGetProductCountByState();
    }, []);

    const renderProducts = () =>
        products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                    const { name, color } = mapProductState(product.state);
                    return (
                        <CardSellingProduct
                            key={product.id}
                            value={{
                                id: product?.id,
                                stateName: name,
                                stateColor: color,
                                start_price: product?.start_price,
                                title: product?.title,
                                duration_days: product?.duration_days,
                                images_url: product?.images_url,
                            }}
                        />
                    );
                })}
            </div>
        ) : (
            <UseEmpty />
        );

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
