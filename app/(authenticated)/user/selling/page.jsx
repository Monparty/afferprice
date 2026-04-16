"use client";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import CardSellingProduct from "@/app/components/utils/CardSellingProduct";
import UseTabs from "@/app/components/utils/UseTabs";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getProductsByState } from "@/app/services/products.service";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Page() {
    const { control } = useForm();
    const [activeTab, setActiveTab] = useState("1");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductsByState("draft");
        const onGetProductsByState = async () => {
            const { data, error } = await getProductsByState("draft");
            if (error) return notifyError(error);
            setProducts(data);
        };
        onGetProductsByState();
    }, []);

    const tabItems = [
        {
            key: "1",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    กำลังประมูล
                    <UseTag label={1} color={activeTab === "1" ? "orange" : undefined} />
                </div>
            ),
            children: "Content of Tab Pane 1",
        },
        {
            key: "2",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    ขายแล้ว <UseTag label={2} color={activeTab === "2" ? "orange" : undefined} />
                </div>
            ),
            children: "Content of Tab Pane 2",
        },
        {
            key: "3",
            label: (
                <div className="flex justify-center items-center gap-2 text-sm px-3">
                    บันทึกร่าง <UseTag label={products?.length} color={activeTab === "3" ? "orange" : undefined} />
                </div>
            ),
            children: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products?.map((product) => (
                        <CardSellingProduct
                            key={product.id}
                            value={{
                                id: product?.id,
                                status: product?.status,
                                start_price: product?.start_price,
                                title: product?.title,
                                duration_days: product?.duration_days,
                                images_url: product?.images_url,
                            }}
                        />
                    ))}
                </div>
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 pb-6 overflow-x-auto">
                    <UseTabs items={tabItems} size="large" onChange={(key) => setActiveTab(key)} />
                </div>
            </div>
        </>
    );
}

export default Page;
