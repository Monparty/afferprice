"use client";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import UseButton from "../../../components/inputs/UseButton";
import UseSteps from "../../../components/utils/UseSteps";
import UseTag from "../../../components/utils/UseTag";
import { getAuctionResultByProduct } from "@/app/services/payment.service";
import { getShipmentByAuctionResult } from "@/app/services/shipment.service";
import {
    CarOutlined,
    CopyOutlined,
    EnvironmentOutlined,
    InboxOutlined,
    InfoCircleFilled,
    PhoneOutlined,
    TruckOutlined,
    WechatOutlined,
} from "@ant-design/icons";

// map shipping_status (preparing | shipped | delivered) → ขั้นที่ active + แท็กสถานะ
const STATUS_CONFIG = {
    preparing: { current: 0, label: "เตรียมจัดส่ง", color: "orange" },
    shipped: { current: 2, label: "กำลังจัดส่ง", color: "orange" },
    delivered: { current: 3, label: "จัดส่งสำเร็จ", color: "green" },
};

// ข้อมูล mock (ใช้เป็น fallback เมื่อไม่มี product param หรือดึงข้อมูลจริงไม่ได้)
const MOCK = {
    orderNo: "BD-987654321",
    title: "Rolex Submariner Date 126610LN",
    image: "https://picsum.photos/190/190",
    finalPrice: 450000,
    shippingCompany: "Kerry Express",
    trackingNumber: "TH1234567890K",
    shippingStatus: "shipped",
};

function buildSteps({ shippingCompany, trackingNumber }) {
    return [
        {
            title: <p className="font-bold">เตรียมจัดส่ง</p>,
            content: (
                <div>
                    <p className="text-sm mb-2">ผู้ขายทำการตรวจสอบและแพ็คสินค้าเรียบร้อยแล้ว</p>
                    <p className="text-xs">20 ต.ค. 2023 • 09:30 น. | กรุงเทพมหานคร</p>
                </div>
            ),
            subTitle: <UseTag label="สำเร็จ" color="green" />,
            icon: <InboxOutlined className="text-base" />,
        },
        {
            title: <p className="font-bold">บริษัทขนส่งรับพัสดุแล้ว</p>,
            content: (
                <div>
                    <p className="text-sm mb-2">
                        พัสดุถูกรับโดย {shippingCompany} และอยู่ที่ศูนย์คัดแยกสินค้า
                    </p>
                    <p className="text-xs">20 ต.ค. 2023 • 14:45 น. | ศูนย์กระจายสินค้า ลาดกระบัง</p>
                </div>
            ),
            subTitle: <UseTag label="สำเร็จ" color="green" />,
            icon: <TruckOutlined className="text-base" />,
        },
        {
            title: <p className="font-bold">กำลังนำจ่าย</p>,
            content: (
                <div>
                    <p className="text-sm mb-2">พัสดุกำลังเดินทางไปยังบ้านของคุณ คาดว่าจะถึงภายในวันนี้</p>
                    <p className="text-xs">21 ต.ค. 2023 • 08:20 น. | เขตบางนา, กรุงเทพฯ</p>
                </div>
            ),
            subTitle: <UseTag label="กำลังดำเนินการ" color="orange" />,
            icon: <CarOutlined className="text-base" />,
        },
        {
            title: <p className="font-bold">จัดส่งสำเร็จ</p>,
            content: (
                <div>
                    <p className="text-sm mb-2">รอการยืนยันการรับสินค้าจากผู้ซื้อ</p>
                </div>
            ),
            subTitle: null,
            icon: <EnvironmentOutlined className="text-base" />,
        },
    ];
}

function OrderContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get("product");
    const [order, setOrder] = useState(MOCK);

    useEffect(() => {
        if (!productId) return;
        (async () => {
            const { data: result } = await getAuctionResultByProduct(productId);
            if (!result) return; // ดึงไม่ได้ → คง mock ไว้
            const { data: shipment } = await getShipmentByAuctionResult(result.id);
            setOrder({
                orderNo: `BD-${result.id.slice(0, 8).toUpperCase()}`,
                title: result.products?.title ?? MOCK.title,
                image: result.products?.images_url?.[0]?.url ?? MOCK.image,
                finalPrice: result.final_price ?? MOCK.finalPrice,
                shippingCompany: shipment?.shipping_company ?? MOCK.shippingCompany,
                trackingNumber: shipment?.tracking_number ?? MOCK.trackingNumber,
                shippingStatus: shipment?.shipping_status ?? MOCK.shippingStatus,
            });
        })();
    }, [productId]);

    const status = STATUS_CONFIG[order.shippingStatus] ?? STATUS_CONFIG.shipped;
    const items = buildSteps(order);

    return (
        <main className="layout-content-container flex flex-col w-full gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
                    ติดตามสถานะการจัดส่ง
                </h1>
                <p className="text-slate-500 dark:text-slate-400">หมายเลขคำสั่งซื้อ: #{order.orderNo}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-48 aspect-square rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                        <Image src={order.image} alt={order.title} width={195} height={195} sizes="195px" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between h-full py-1">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                                        รายการสินค้าที่คุณชนะ
                                    </p>
                                    <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">
                                        {order.title}
                                    </h3>
                                </div>
                                <UseTag color={status.color} label={status.label} />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                ราคาชนะประมูล:{" "}
                                <span className="text-slate-900 dark:text-white font-bold">
                                    ฿{order.finalPrice?.toLocaleString()}
                                </span>
                            </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-lg border border-slate-100 dark:border-zinc-800">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
                                หมายเลขติดตามพัสดุ
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-slate-900 dark:text-white text-lg font-mono font-bold">
                                    {order.trackingNumber}
                                </p>
                                <UseButton
                                    label="คัดลอก"
                                    type="default"
                                    icon={CopyOutlined}
                                    onClick={() => navigator.clipboard?.writeText(order.trackingNumber ?? "")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 p-6">
                <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-8">สถานะการจัดส่งล่าสุด</h4>
                <UseSteps items={items} current={status.current} orientation="vertical" height="h-[7rem]" />
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                    <UseButton label="ติดต่อผู้ขาย" size="large" icon={WechatOutlined} />
                    <UseButton label="ติดต่อบริษัทขนส่ง" size="large" type="default" icon={PhoneOutlined} />
                </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-600 flex items-start gap-4">
                <InfoCircleFilled className="text-xl text-orange-600!" />
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">คำแนะนำ</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        กรุณาถ่ายวิดีโอขณะเปิดกล่องพัสดุเพื่อใช้เป็นหลักฐานในกรณีที่เกิดปัญหาหรือสินค้าไม่ตรงตามที่ประมูล
                    </p>
                </div>
            </div>
        </main>
    );
}

function Page() {
    return (
        <Suspense fallback={null}>
            <OrderContent />
        </Suspense>
    );
}

export default Page;
