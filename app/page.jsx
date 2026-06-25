"use client";
import Link from "next/link";
import { useState } from "react";
import LandingPage from "./components/utils/LandingPage";

function Page() {
    const [showDev, setShowDev] = useState(false);

    return (
        <div className="w-full max-w-360 mx-auto py-6 px-4 md:px-10">
            <div className="hidden">
                <button
                    onClick={() => setShowDev(!showDev)}
                    className="h-fit w-fit bg-blue-400 p-4 fixed z-100 m-4 right-0 rounded-lg  text-white flex opacity-50 cursor-pointer"
                >
                    Dev
                </button>
                <div className={`${showDev ? "block" : "hidden"}`}>
                    <div className="h-fit w-fit bg-blue-400 p-4 fixed z-100 m-4 right-0 top-36 rounded-lg font-bold text-white flex gap-4">
                        <Link href="/order">order</Link>
                    </div>
                    <div className="h-fit w-fit bg-red-500 p-4 fixed z-100 m-4 right-0 top-51 rounded-lg font-bold text-white">
                        <div>สิ่งที่ต้องแก้ต่อ</div>
                        <p className="font-normal mt-2 underline">✅ เสร็จแล้ว</p>
                        <ul className="ps-4 list-disc font-normal">
                            <li>flow สร้าง → ตรวจสอบ → แจ้งเตือน → ประมูล → ชำระเงิน → จัดส่ง</li>
                            <li>นับถอยหลังใน Card แบบ realtime</li>
                            <li>ระบบเติมเงินผ่าน Omise (ผูกจริงแล้ว)</li>
                            <li>เงื่อนไขแสดง content หน้าแรก (LandingPage2 ดึงข้อมูลจริงทุก section)</li>
                            <li>แจ้งเตือน admin: สินค้ารออนุมัติ + KYC (badge ที่ sidebar)</li>
                            <li>ผู้ซื้อกด &quot;ยืนยันรับสินค้า&quot; + อัปโหลด VDO แกะกล่อง → สถานะ &quot;จัดส่งสำเร็จ&quot;</li>
                            <li>login ด้วย OTP (อีเมล) — ต้องเพิ่ม {`{{ .Token }}`} ใน email template ของ Supabase</li>
                            <li>filter ฝั่งซ้ายหน้า /categories responsive (stack บนมือถือ)</li>
                            <li>ปรับ UX: สร้างสินค้าแรก + KYC พร้อมกัน → แจ้งให้กลับมากดส่งตรวจหลัง KYC ผ่าน</li>
                        </ul>
                        <p className="font-normal mt-2 underline">⏳ เหลือ</p>
                        <ul className="ps-4 list-decimal font-normal">
                            <li>ปรับ responsive หน้าอื่นๆ (นอกจาก /categories)</li>
                            <li>ทำ db ทดสอบ แยกกับ db จริง (infra ไม่ใช่โค้ด)</li>
                        </ul>
                    </div>
                </div>
            </div>
            <LandingPage />
        </div>
    );
}

export default Page;
