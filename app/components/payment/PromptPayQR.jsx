"use client";

import { useState } from "react";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import UseModal from "../utils/UseModal";
import UseButton from "../inputs/UseButton";
import UseSkeleton from "../utils/UseSkeleton";

const LISTING_FEE = 30;

function PromptPayQR({ amount = LISTING_FEE }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);
    const user = useSelector((state) => state.user.data);
    const userId = user?.id;

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        const res = await fetch("/api/payment/promptpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, amount }),
        });
        const data = await res.json();
        setQrData(data);
        setLoading(false);
    };

    function CardSkeleton() {
        return (
            <div className="grid gap-6">
                <UseSkeleton />
                <UseSkeleton />
            </div>
        );
    }

    return (
        <>
            <UseButton label="ชำระด้วย PromptPay" onClick={handleOpen} />

            <UseModal open={open} onCancel={() => setOpen(false)} title="ข้อมูลการชำระเงิน">
                {loading ? (
                    <CardSkeleton />
                ) : (
                    <>
                        {qrData?.qrCodeUrl && (
                            <div className="flex w-full flex-col items-center gap-3">
                                <div className="w-full flex flex-col items-center">
                                    <div className="flex justify-between w-1/2 items-center py-3 border-b border-slate-200">
                                        <p>ยอดชำระเงินทั้งหมด</p>
                                        <p className="font-semibold text-orange-600">฿{amount}</p>
                                    </div>
                                    <div className="flex justify-between w-1/2 items-center py-3 border-b border-slate-200">
                                        <p>กรุณาชำระภายใน</p>
                                        <p className="font-semibold text-orange-600">
                                            {new Date(qrData.expiresAt).toLocaleString("th-TH")}
                                        </p>
                                    </div>
                                </div>
                                <img src={qrData.qrCodeUrl} alt="PromptPay QR" className="w-80 h-80" />
                                <p className="font-semibold text-orange-600">฿{amount}</p>
                                <div className="grid gap-1 text-center">
                                    <p>บริษัท Afferprice จำกัด</p>
                                    <p>รหัสอ้างอิง TEST123456789</p>
                                </div>
                                <div className="grid gap-1 text-sm w-3/5">
                                    <h2 className="mb-3 font-semibold">กรุณาทำตามขั้นตอนที่แนะนำ</h2>
                                    <ul className="mb-3 text-gray-500 grid gap-2">
                                        <li>1. คลิกปุ่ม "บันทึก QR" หรือแคปหน้าจอ</li>
                                        <li>2. เปิดแอปพลิเดชันธนาคารบนอุปกรณ์ของท่าน</li>
                                        <li>3. เลือกไปที่ปุ่ม "สแกน" หรือ "QR Code" และกดที่ "รูปภาพ"</li>
                                        <li>
                                            4. เลือกรูปภาพที่ท่านแคปไว้และทำการชำระเงิน
                                            โดยกรุณาเช็คชื่อบัญบัญชีผู้รับคือ "บริษัท ช้อปปี้เพย์ (ประเทศไทย) จำกัด"
                                        </li>
                                        <li>
                                            5. คำสั่งซื้อจะได้รับการยืนยันทันทีหลังจากช่าระเงินสำเร็จ หรือภายใน 24
                                            ชั่วโมง ในกรณีที่มีธุรกรรมจำนวนมาก
                                        </li>
                                        <li>
                                            6. QR สามารถสแกนได้ 1 ครั้งต่อ 1 การชำระเงินเท่านั้น หากต้องการสแกนใหม่
                                            โปรดรีเฟรช QR อีกครั้ง
                                        </li>
                                    </ul>
                                    <p className="text-xs text-gray-500">
                                        หมายเหตุ: ช่องทางช่าระเงินพร้อมเพย์ใช้ได้กับแอปพลิเดชันธนาคารเท่านั้น
                                        ไม่สามารถช่าระผ่านสาขา ธนาคารหรือตู้เอทีเอ็ม
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </UseModal>
        </>
    );
}

export default PromptPayQR;
