"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UseTag from "@/app/components/utils/UseTag";
import { CarOutlined, FieldTimeOutlined, InboxOutlined, MoreOutlined, TeamOutlined, WalletOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import imageNotFound from "../../../public/images/imageNotFound.png";
import UsePopover from "./UsePopover";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCountdown } from "@/app/utils/dateUtils";
import dayjs from "dayjs";

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
        return null; // paid → UseTag "รอจัดส่งสินค้า" ใน body; pending → ปุ่ม "ชำระเงิน" ใน body
    }
    if (stateName === "มีผู้ชนะ") {
        return null; // paid → ปุ่ม "ระบุข้อมูลการจัดส่ง" ใน body; pending → UseTag "รอผู้ซื้อชำระเงิน" ใน body
    }
    return null;
}

function CardSellingProduct({ value }) {
    const router = useRouter();
    const action = getPopoverAction(value);
    const [countdown, setCountdown] = useState(() => formatCountdown(value.auction_end_time));

    // ประมูลมีผู้ชนะ — แยก UI ตามฝั่ง (ผู้ขาย/ผู้ซื้อ) + สถานะชำระเงิน
    const isPaid = value.paymentStatus === "paid";
    const isPendingPayment = !isPaid;
    // state='order' — ผู้ขายจัดส่งแล้ว: แสดงปุ่มติดตามสถานะทั้งฝั่งผู้ขายและผู้ซื้อ
    const isShipping = value.stateName === "การจัดส่ง";
    const sellerWaitingPay = value.stateName === "มีผู้ชนะ" && isPendingPayment;
    const sellerNeedShip = value.stateName === "มีผู้ชนะ" && isPaid;
    const buyerNeedPay = value.isBuyer && isPendingPayment && !isShipping;
    const buyerWaitingShip = value.isBuyer && isPaid && !isShipping;

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
                {action && (
                    <div className="absolute top-3 right-3 z-10">
                        <UsePopover placement="bottomRight" content={<div className="grid gap-1 w-30">{action}</div>}>
                            <UseButton shape="circle" type="default" icon={MoreOutlined} />
                        </UsePopover>
                    </div>
                )}
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
                {value.created_at && (
                    <span className="text-[10px] text-slate-400 mb-1">
                        สร้างเมื่อ {dayjs(value.created_at).format("DD/MM/YYYY")}
                    </span>
                )}
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
                {sellerWaitingPay && (
                    <div className="mt-4">
                        <UseTag label="รอผู้ซื้อชำระเงิน" color="orange" icon={WalletOutlined} />
                    </div>
                )}
                {sellerNeedShip && (
                    <div className="mt-4">
                        <UseButton
                            label="ระบุข้อมูลการจัดส่ง"
                            icon={CarOutlined}
                            wFull
                            onClick={() => router.push(`/user/checkout/${value.id}`)}
                        />
                    </div>
                )}
                {buyerNeedPay && (
                    <div className="mt-4">
                        <UseButton
                            label="ชำระเงิน"
                            icon={WalletOutlined}
                            wFull
                            onClick={() => router.push(`/user/checkout/${value.id}`)}
                        />
                    </div>
                )}
                {buyerWaitingShip && (
                    <div className="mt-4">
                        <UseTag label="รอจัดส่งสินค้า" color="blue" icon={CarOutlined} />
                    </div>
                )}
                {isShipping && (
                    <div className="mt-4">
                        <UseButton
                            label="ตรวจสอบสถานะการจัดส่ง"
                            icon={InboxOutlined}
                            wFull
                            onClick={() => router.push(`/user/order?product=${value.id}`)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardSellingProduct;
