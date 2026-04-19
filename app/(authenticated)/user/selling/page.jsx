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

function Page() {
    const { control } = useForm();
    const [activeTab, setActiveTab] = useState("draft");
    const [products, setProducts] = useState([]);
    const [countState, setCountState] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const onGetProductsByState = async () => {
            const { data, error } = await getProductsByState(activeTab);
            if (error) return notifyError(error);
            setProducts(data);
        };
        onGetProductsByState();
    }, [activeTab]);

    useEffect(() => {
        const states = ["draft", "pending_review", "rejected", "active", "ended", "sold", "cancelled"];
        const onGetProductCountByState = async () => {
            const counts = {};
            for (const s of states) {
                const { count } = await getProductCountByState(s);
                counts[s] = count;
            }
            setCountState(counts);
            setLoading(false);
        };
        onGetProductCountByState();
    }, []);

    const tabItems = [
        {
            key: "draft",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    บันทึกร่าง
                    <UseTag label={countState?.draft || 0} color={activeTab === "draft" ? "orange" : undefined} />
                </div>
            ),
            children:
                products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <CardSellingProduct
                                key={product.id}
                                value={{
                                    id: product?.id,
                                    state: product?.state,
                                    start_price: product?.start_price,
                                    title: product?.title,
                                    duration_days: product?.duration_days,
                                    images_url: product?.images_url,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <UseEmpty />
                ),
        },
        {
            key: "pending_review",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    รออนุมัติ
                    <UseTag
                        label={countState?.pending_review || 0}
                        color={activeTab === "pending_review" ? "orange" : undefined}
                    />
                </div>
            ),
            children:
                products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <CardSellingProduct
                                key={product.id}
                                value={{
                                    id: product?.id,
                                    state: product?.state,
                                    start_price: product?.start_price,
                                    title: product?.title,
                                    duration_days: product?.duration_days,
                                    images_url: product?.images_url,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <UseEmpty />
                ),
        },
        {
            key: "rejected",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    ไม่อนุมัติ
                    <UseTag label={countState?.rejected || 0} color={activeTab === "rejected" ? "orange" : undefined} />
                </div>
            ),
            children:
                products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <CardSellingProduct
                                key={product.id}
                                value={{
                                    id: product?.id,
                                    state: product?.state,
                                    start_price: product?.start_price,
                                    title: product?.title,
                                    duration_days: product?.duration_days,
                                    images_url: product?.images_url,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <UseEmpty />
                ),
        },
        {
            key: "active",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    กำลังประมูล
                    <UseTag label={countState?.active || 0} color={activeTab === "active" ? "orange" : undefined} />
                </div>
            ),
            children:
                products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <CardSellingProduct
                                key={product.id}
                                value={{
                                    id: product?.id,
                                    state: product?.state,
                                    start_price: product?.start_price,
                                    title: product?.title,
                                    duration_days: product?.duration_days,
                                    images_url: product?.images_url,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <UseEmpty />
                ),
        },
        {
            key: "ended",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    หมดเวลาประมูล
                    <UseTag label={countState?.ended || 0} color={activeTab === "ended" ? "orange" : undefined} />
                </div>
            ),
            children:
                products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <CardSellingProduct
                                key={product.id}
                                value={{
                                    id: product?.id,
                                    state: product?.state,
                                    start_price: product?.start_price,
                                    title: product?.title,
                                    duration_days: product?.duration_days,
                                    images_url: product?.images_url,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <UseEmpty />
                ),
        },
        {
            key: "sold",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    มีผู้ชนะ
                    <UseTag label={countState?.sold || 0} color={activeTab === "sold" ? "orange" : undefined} />
                </div>
            ),
            children:
                products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <CardSellingProduct
                                key={product.id}
                                value={{
                                    id: product?.id,
                                    state: product?.state,
                                    start_price: product?.start_price,
                                    title: product?.title,
                                    duration_days: product?.duration_days,
                                    images_url: product?.images_url,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <UseEmpty />
                ),
        },
        {
            key: "cancelled",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    ยกเลิก
                    <UseTag
                        label={countState?.cancelled || 0}
                        color={activeTab === "cancelled" ? "orange" : undefined}
                    />
                </div>
            ),
            children:
                products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products?.map((product) => (
                            <CardSellingProduct
                                key={product.id}
                                value={{
                                    id: product?.id,
                                    state: product?.state,
                                    start_price: product?.start_price,
                                    title: product?.title,
                                    duration_days: product?.duration_days,
                                    images_url: product?.images_url,
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <UseEmpty />
                ),
        },
    ];

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
