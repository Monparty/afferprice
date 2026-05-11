"use client";
import UseButton from "@/app/components/inputs/UseButton";
import { ArrowLeftOutlined, CheckCircleFilled, DownloadOutlined, FileDoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAuctionResultById } from "@/app/services/payment.service";
import { notifyError } from "@/app/providers/NotificationProvider";

const AUCTION_FEE_RATE = 0.05;

function formatPrice(n) {
    return `฿${Number(n).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
}

function Page() {
    const { id } = useParams();
    const user = useSelector((state) => state.user.data);
    const [result, setResult] = useState(null);
    const [qrData, setQrData] = useState(null);

    useEffect(() => {
        if (!id) return;
        getAuctionResultById(id).then(({ data, error }) => {
            if (error) return notifyError(error);
            setResult(data);
        });
    }, [id]);

    useEffect(() => {
        if (!result || !user?.id) return;
        const finalPrice = Number(result.final_price ?? 0);
        const total = Math.round(finalPrice + finalPrice * AUCTION_FEE_RATE);
        fetch("/api/payment/promptpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, amount: total, auctionResultId: id }),
        })
            .then((r) => r.json())
            .then(setQrData)
            .catch(() => {});
    }, [result, user?.id]);

    const product = result?.products;
    const finalPrice = Number(result?.final_price ?? 0);
    const fee = Math.round(finalPrice * AUCTION_FEE_RATE);
    const total = finalPrice + fee;

    return (
        <main className="grid place-items-center">
            <div className="w-fit space-y-6 text-center">
                <div className="grid place-items-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                        <CheckCircleFilled className="text-2xl! text-green-600!" />
                    </div>
                    <p className="text-gray-500">ขอบคุณสำหรับการประมูล รายการของคุณกำลังดำเนินการ</p>
                </div>

                <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm font-medium text-gray-600">สแกนคิวอาร์โค้ดเพื่อชำระเงิน</p>
                        <div className="bg-white p-4 rounded-lg border-2 border-gray-100 shadow-inner">
                            <div className="aspect-square w-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                {qrData?.qrCodeUrl ? (
                                    <img src={qrData.qrCodeUrl} alt="PromptPay QR" className="w-full h-full" />
                                ) : (
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-size-[20px_20px] animate-pulse" />
                                )}
                            </div>
                        </div>
                        <div className="w-full text-center space-y-1">
                            <p className="text-sm text-gray-500">ยอดชำระทั้งหมด</p>
                            <p className="text-3xl font-bold text-primary">{formatPrice(total)}</p>
                        </div>
                        <UseButton
                            label="บันทึกรูปภาพ"
                            icon={DownloadOutlined}
                            type="default"
                            className="h-12! text-base! font-bold!"
                            wFull
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-left">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileDoneOutlined className="text-xl! text-orange-600!" />
                        รายละเอียดการสั่งซื้อ
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-gray-500 text-sm">ชื่อสินค้า</span>
                            <span className="text-gray-900 text-sm font-semibold text-right">
                                {product?.title || "—"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">รหัสรายการ</span>
                            <span className="text-gray-900 text-sm font-mono uppercase">
                                {id ? `AR-${id.slice(0, 8).toUpperCase()}` : "—"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">ราคาชนะประมูล</span>
                            <span className="text-gray-900 text-sm font-semibold">{formatPrice(finalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">ค่าธรรมเนียม (5%)</span>
                            <span className="text-gray-900 text-sm font-semibold">{formatPrice(fee)}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center gap-4">
                            <span className="text-gray-900 font-bold">ยอดชำระสุทธิ</span>
                            <span className="text-gray-900 font-bold text-lg">{formatPrice(total)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <UseButton label="ไปที่การประมูลของฉัน" className="h-12! text-base! font-bold!" wFull />
                    <Link href="/">
                        <div className="text-sm flex gap-2 justify-center items-center">
                            <ArrowLeftOutlined /> กลับสู่หน้าหลัก
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default Page;
