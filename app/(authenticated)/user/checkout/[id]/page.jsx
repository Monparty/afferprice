"use client";
import UseButton from "../../../../components/inputs/UseButton";
import {
    BankFilled,
    CheckCircleFilled,
    CreditCardFilled,
    LockFilled,
    PlusOutlined,
    QrcodeOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import UseTag from "../../../../components/utils/UseTag";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuctionResultByProduct } from "@/app/services/payment.service";
import { notifyError } from "@/app/providers/NotificationProvider";

const SHIPPING_OPTIONS = [
    { value: "express", label: "Express Delivery (ด่วนพิเศษ)", desc: "ได้รับสินค้าภายใน 1-2 วันทำการ", fee: 80 },
    { value: "standard", label: "Standard Delivery (ธรรมดา)", desc: "ได้รับสินค้าภายใน 3-5 วันทำการ", fee: 40 },
    {
        value: "pickup",
        label: "Self-pickup (รับสินค้าด้วยตัวเอง)",
        desc: "รับสินค้าที่คลังสินค้าหลัก (ลาดพร้าว)",
        fee: 0,
    },
];

const AUCTION_FEE_RATE = 0.05;

function formatPrice(n) {
    return `฿${Number(n).toLocaleString("th-TH")}`;
}

function Page() {
    const router = useRouter();
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [shipping, setShipping] = useState("express");

    useEffect(() => {
        if (!id) return;
        getAuctionResultByProduct(id).then(({ data, error }) => {
            if (error) return notifyError(error);
            setResult(data);
        });
    }, [id]);

    const product = result?.products;
    const finalPrice = Number(result?.final_price ?? 0);
    const auctionFee = Math.round(finalPrice * AUCTION_FEE_RATE);
    const shippingFee = SHIPPING_OPTIONS.find((o) => o.value === shipping)?.fee ?? 0;
    const total = finalPrice + auctionFee + shippingFee;
    const productImage = product?.images_url?.[0]?.url;

    return (
        <main className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-6">
                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="flex items-center bg-orange-600 justify-center w-8 h-8 rounded-full text-white text-sm font-bold">
                            1
                        </span>
                        <h2 className="text-xl font-bold">สรุปรายการสินค้าที่ชนะ</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 rounded-xl bg-gray-50">
                        <Image
                            src={productImage || "https://picsum.photos/192/128"}
                            unoptimized
                            alt={product?.title || "product"}
                            className="w-full md:w-48 h-32 object-cover rounded-lg"
                            width={192}
                            height={128}
                            sizes="(max-width: 768px) 100vw, 192px"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-black mb-1">
                                    {product?.title || "กำลังโหลด..."}
                                </h3>
                                <p className="text-sm text-gray-500">รหัสการประมูล: #{id?.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <UseTag label="ราคาชนะประมูล" color="orange" />
                                <div className="mt-1">
                                    <span className="text-2xl font-bold text-black">
                                        {result ? formatPrice(finalPrice) : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center bg-orange-600 justify-center w-8 h-8 rounded-full text-white text-sm font-bold">
                                2
                            </span>
                            <h2 className="text-xl font-bold">ที่อยู่จัดส่ง</h2>
                        </div>
                        <UseButton label="เพิ่มที่อยู่ใหม่" type="default" icon={PlusOutlined} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative p-4 border-2 border-primary rounded-xl bg-primary/5 cursor-pointer">
                            <div className="absolute top-4 right-4">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                            </div>
                            <h4 className="font-bold mb-1">สมชาย สายประมูล (ที่บ้าน)</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                123/45 ถนนสุขุมวิท แขวงคลองเตยเหนือ
                                <br />
                                เขตวัฒนา กรุงเทพมหานคร 10110
                                <br />
                                โทร: 081-234-5678
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="flex items-center justify-center bg-orange-600 w-8 h-8 rounded-full text-white text-sm font-bold">
                            3
                        </span>
                        <h2 className="text-xl font-bold">รูปแบบการจัดส่ง</h2>
                    </div>
                    <div className="space-y-3">
                        {SHIPPING_OPTIONS.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-primary has-checked:bg-primary/5"
                            >
                                <div className="flex items-center gap-4">
                                    <input
                                        checked={shipping === opt.value}
                                        onChange={() => setShipping(opt.value)}
                                        className="text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                        name="shipping"
                                        type="radio"
                                        value={opt.value}
                                    />
                                    <div>
                                        <p className="font-bold">{opt.label}</p>
                                        <p className="text-xs text-gray-500">{opt.desc}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-black">{opt.fee === 0 ? "ฟรี" : `฿${opt.fee}`}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="flex items-center justify-center bg-orange-600 w-8 h-8 rounded-full text-white text-sm font-bold">
                            4
                        </span>
                        <h2 className="text-xl font-bold">ช่องทางชำระเงิน</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl cursor-pointer hover:border-primary has-checked:border-primary has-checked:bg-primary/5 text-center transition-all">
                            <input defaultChecked className="sr-only" name="payment" type="radio" value="promptpay" />
                            <QrcodeOutlined className="text-xl! text-black! mb-4" />
                            <p className="font-bold text-sm">Thai QR PromptPay</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase">Instant Payment</p>
                        </label>
                        <label className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl cursor-pointer hover:border-primary has-checked:border-primary has-checked:bg-primary/5 text-center transition-all">
                            <input className="sr-only" name="payment" type="radio" value="card" />
                            <CreditCardFilled className="text-xl! text-black! mb-4" />
                            <p className="font-bold text-sm">Credit / Debit Card</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase">Visa, Mastercard, JCB</p>
                        </label>
                        <label className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl cursor-pointer hover:border-primary has-checked:border-primary has-checked:bg-primary/5 text-center transition-all">
                            <input className="sr-only" name="payment" type="radio" value="transfer" />
                            <BankFilled className="text-xl! text-black! mb-4" />
                            <p className="font-bold text-sm">Mobile Banking</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase">Bank Transfer</p>
                        </label>
                    </div>
                </section>
            </div>

            <div className="w-full lg:w-95">
                <div className="sticky top-12 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-300">
                        <h2 className="text-xl font-bold mb-6">สรุปยอดชำระเงิน</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>ราคาชนะประมูล</span>
                                <span className="font-semibold text-black">{formatPrice(finalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>ค่าธรรมเนียมการประมูล (5%)</span>
                                <span className="font-semibold text-black">{formatPrice(auctionFee)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>
                                    ค่าจัดส่ง ({SHIPPING_OPTIONS.find((o) => o.value === shipping)?.label.split(" ")[0]}
                                    )
                                </span>
                                <span className="font-semibold text-black">
                                    {shippingFee === 0 ? "ฟรี" : formatPrice(shippingFee)}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">
                                        ยอดรวมสุทธิ
                                    </p>
                                    <p className="text-xs text-gray-400 italic">(รวมภาษีมูลค่าเพิ่มแล้ว)</p>
                                </div>
                                <span className="text-3xl text-orange-600 font-bold">{formatPrice(total)}</span>
                            </div>
                        </div>
                        <UseButton
                            label="ยืนยันการชำระเงิน"
                            className="h-12! text-lg! font-bold!"
                            onClick={() => router.push(`/payment/${id}`)}
                            wFull
                            disabled={!result}
                        />
                        <div className="mt-4 text-xs text-gray-400 text-center">
                            <LockFilled />
                            <p className="flex items-center justify-center gap-1">
                                ข้อมูลของคุณจะถูกเก็บเป็นความลับ
                                <br />
                                และปลอดภัยภายใต้มาตรฐานสากล
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-1 flex-col items-center text-center">
                            <SafetyOutlined className="text-lg text-blue-500!" />
                            <p className="text-xs font-semibold">ความปลอดภัยสูงสุด</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-1 flex-col items-center text-center">
                            <CheckCircleFilled className="text-lg text-blue-500!" />
                            <p className="text-xs font-semibold">ผู้ขายผ่านการรับรอง</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Page;
