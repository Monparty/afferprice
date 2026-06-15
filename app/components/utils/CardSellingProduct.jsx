"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UseTag from "@/app/components/utils/UseTag";
import { FieldTimeOutlined, MoreOutlined, TeamOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import imageNotFound from "../../../public/images/imageNotFound.png";
import UsePopover from "./UsePopover";
import Link from "next/link";

function padTwo(n) {
    return String(n).padStart(2, "0");
}

function formatCountdown(endTime) {
    if (!endTime) return null;
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return { ended: true, text: "หมดเวลา" };
    const total = Math.floor(diff / 1000);
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    if (days > 0) return { ended: false, text: `${days} วัน ${padTwo(hours)} ชม.` };
    return { ended: false, text: `${padTwo(hours)}:${padTwo(minutes)}:${padTwo(seconds)}` };
}

function getPopoverAction(value) {
    const { stateName, isBuyer, isLost, paymentStatus, id } = value;
    const isPaid = paymentStatus === "paid";
    const linkCls = "text-black! dark:text-slate-200! hover:bg-gray-100! dark:hover:bg-zinc-700! p-1 rounded-sm text-sm";
    const textCls = "text-slate-500 dark:text-slate-400 text-sm p-1";

    if (["บันทึกร่าง", "รออนุมัติ", "ไม่อนุมัติ"].includes(stateName)) {
        return (
            <Link href={`/user/add-product/${id}/edit`} className={linkCls}>
                แก้ไข
            </Link>
        );
    }
    if (stateName === "กำลังประมูล") {
        return (
            <Link href={`/product/${id}`} className={linkCls}>
                ดูสินค้า
            </Link>
        );
    }
    if (isLost) {
        return (
            <Link href={`/product/${id}`} className={linkCls}>
                ดูสินค้า
            </Link>
        );
    }
    if (isBuyer) {
        if (isPaid) return <span className={textCls}>รอจัดส่งสินค้า</span>;
        return (
            <Link href={`/user/checkout/${id}`} className={linkCls}>
                ตรวจสอบ
            </Link>
        );
    }
    if (stateName === "มีผู้ชนะ") {
        if (isPaid)
            return (
                <Link href={`/user/checkout/${id}`} className={linkCls}>
                    ระบุข้อมูลการจัดส่ง
                </Link>
            );
        return <span className={textCls}>รอชำระเงิน</span>;
    }
    return null;
}

function CardSellingProduct({ value }) {
    const action = getPopoverAction(value);
    const [countdown, setCountdown] = useState(() => formatCountdown(value.auction_end_time));

    useEffect(() => {
        if (!value.auction_end_time) return;
        const tick = () => setCountdown(formatCountdown(value.auction_end_time));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [value.auction_end_time]);

    return (
        <div className="group flex flex-col bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                    <UseTag label={value.stateName} color={value.stateColor} className="capitalize" />
                </div>
                <div className="absolute top-3 right-3 z-10">
                    <UsePopover placement="bottomRight" content={<div className="grid gap-1 w-30">{action}</div>}>
                        <UseButton shape="circle" type="default" icon={MoreOutlined} />
                    </UsePopover>
                </div>
                <Image
                    src={value.images_url?.[0].url || imageNotFound}
                    alt={value.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={300}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-blue-500 dark:text-blue-400 font-bold line-clamp-1 mb-1">{value.title}</h3>
                <div className="flex justify-between items-end">
                    <div className="flex flex-col items-baseline gap-1 mt-auto">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">ราคาปัจจุบัน</span>
                        <span className="text-primary font-black text-lg">฿{value.start_price?.toLocaleString()}</span>
                    </div>
                    {value.isBidder && (
                        <UseTag label="คุณได้ร่วมประมูล" color="blue" />
                    )}
                </div>
                <div className="grid grid-cols-2 gap-1 mt-4 pt-4 border-t border-slate-200 dark:border-zinc-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ผู้ประมูล</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">เหลือเวลา</span>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <TeamOutlined />
                            <span className="text-sm font-bold text-blue-500">
                                {value.bidders_count ?? 0} ราย
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-red-500">
                            <FieldTimeOutlined />
                            <span className="text-sm font-bold">
                                {countdown?.text ?? `${value.duration_days ?? 0} วัน`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardSellingProduct;
