"use client";
import { useEffect, useState } from "react";
import UseButton from "../inputs/UseButton";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    FieldTimeOutlined,
    FrownOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import { getProducts } from "@/app/services/products.service";
import { notifyError } from "@/app/providers/NotificationProvider";
import { useRouter } from "next/navigation";

function CardDrawer({ onClose }) {
    const [products, setProducts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const onGetProducts = async () => {
            const { data, error } = await getProducts();
            if (error) return notifyError(error);
            setProducts(data);
        };
        onGetProducts();
    }, []);

    return (
        <>
            <div className="p-4 rounded-xl bg-white border border-red-100 hover:border-red-200 hover:shadow-md transition-all group">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                        <FrownOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-slate-900 font-bold text-sm">คุณถูกประมูลแซงแล้ว!</h3>
                            <span className="text-[10px] text-slate-400 font-medium">1 นาทีที่แล้ว</span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed mb-4">
                            มีผู้เสนอราคาสูงกว่าคุณในรายการ{" "}
                            <span className="text-slate-900 font-medium">Vintage Rolex Oyster Perpetual</span>
                            <br />
                            ราคาปัจจุบัน: <span className="text-slate-900 font-bold">฿45,500</span>
                        </p>
                        <UseButton label="ประมูลใหม่ทันทีเป็น ฿47,000" />
                    </div>
                </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <FieldTimeOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-slate-900 font-bold text-sm">การประมูลกำลังจะสิ้นสุด!</h3>
                            <span className="text-[10px] text-slate-400 font-medium">3 นาทีที่แล้ว</span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed mb-3">
                            รายการ <span className="text-slate-900 font-medium">First Edition Charizard Card</span>{" "}
                            กำลังจะจบลงในอีก <span className="text-amber-600 font-bold">2น. 45ว.</span>
                        </p>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                            <div className="h-full bg-amber-500 w-[15%]"></div>
                        </div>
                        <UseButton label="ดูสินค้า" type="default" />
                    </div>
                </div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-green-100 hover:border-green-200 hover:shadow-md transition-all">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                        <SmileOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-slate-900 font-bold text-sm">ยินดีด้วย! คุณชนะการประมูล</h3>
                            <span className="text-[10px] text-slate-400 font-medium">2 ชม. ที่แล้ว</span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            คุณชนะการประมูลสำหรับรายการ{" "}
                            <span className="text-slate-900 font-medium">Professional Leica M10 Body</span>
                        </p>
                        <p className="text-[11px] text-green-600 mt-2 font-bold">ราคาที่ชนะ: ฿185,000</p>
                    </div>
                </div>
            </div>
            {(products || [])
                .filter((product) => product.state === "active")
                .map((product) => (
                    <div className="p-4 rounded-xl bg-white border border-green-100 hover:border-blue-200 hover:shadow-md transition-all">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                <CheckCircleOutlined style={{ fontSize: "20px" }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-900 font-bold text-sm">สินค้าของคุณได้รับการอนุมัติ</h3>
                                    <span className="text-[10px] text-slate-400 font-medium">2 ชม. ที่แล้ว</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                                    ดูการประมูลสินค้าของคุณได้เลยตอนนี้{" "}
                                    <span className="text-slate-900 font-medium">{product.title}</span>
                                </p>
                                <UseButton
                                    label="ดูสินค้า"
                                    type="default"
                                    onClick={() => {
                                        router.push(`/product/${product.id}`);
                                        onClose();
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

            {(products || [])
                .filter((product) => product.state === "rejected")
                .map((product) => (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 hover:border-red-200 hover:shadow-md transition-all group">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                                <CloseCircleOutlined style={{ fontSize: "20px" }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-900 font-bold text-sm">สินค้าของคุณไม่ผ่านการอนุมัติ</h3>
                                    <span className="text-[10px] text-slate-400 font-medium">1 นาทีที่แล้ว</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                                    กรุณาตรวจสอบสินค้าของคุณใหม่อีกครั้ง{" "}
                                    <span className="text-slate-900 font-medium">{product?.title}</span>
                                </p>
                                <UseButton
                                    label="ตรวจสอบสินค้า"
                                    type="default"
                                    onClick={() => {
                                        router.push(`/user/add-product/${product.id}/edit`);
                                        onClose();
                                    }}
                                    className="bg-red-400! text-white!"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 opacity-80">
                <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <EyeOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-slate-700 font-semibold text-sm">ความสนใจใหม่</h3>
                            <span className="text-[10px] text-slate-400 font-medium">5 ชม. ที่แล้ว</span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">
                            มีคนเพิ่ม <span className="text-slate-700">Antique Writing Desk</span>{" "}
                            ของคุณลงในรายการที่เฝ้าดูเพิ่มขึ้น 12 คน
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CardDrawer;
