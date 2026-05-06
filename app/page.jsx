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
                        <Link href="/product">product</Link>
                        <Link href="/checkout">checkout</Link>
                        <Link href="/payment">payment</Link>
                        <Link href="/order">order</Link>
                    </div>
                    <div className="h-fit w-fit bg-red-500 p-4 fixed z-100 m-4 right-0 top-51 rounded-lg font-bold text-white">
                        <div>สิ่งที่ต้องแก้ต่อ</div>
                        <ul className="ps-4 list-decimal">
                            <li>ทำ flow สร้างสิ้นค้า ตรวจสอบ แจ้งเตือน ประมูล ชำระเงิน จัดส่ง</li>
                            <li>เพิ่ม Omise payment (เพิ่ม linepay, wallet)</li>
                            <li>เพิ่ม login (OTP)</li>
                            <li>เพิ่ม รายละเอียดหน้าแรก</li>
                            <li>add product เพิ่ม section ประเภทต่างๆ</li>
                            <li>ปรับ SEO</li>
                            <li>เพิ่ม ข้อกำหนดการใช้งาน และ นโยบายความเป็นส่วนตัว /terms, /privacy</li>
                            <li>ถาม flow ในหน้า product [id]</li>
                            <li>แก้เงื่อนไขการแสดงผล content หน้าแรก</li>
                            <li>add favorite</li>
                            <li>add session timeout</li>
                        </ul>
                    </div>
                </div>
            </div>
            <LandingPage />
        </div>
    );
}

export default Page;
