"use client";
import Link from "next/link";
import { useState } from "react";
import LandingPage from "./components/utils/LandingPage";

function Page() {
    const [showDev, setShowDev] = useState(false);

    return (
        <div className="w-full max-w-360 mx-auto py-6 px-4 md:px-10">
            <div className="//hidden">
                <button
                    onClick={() => setShowDev(!showDev)}
                    className="h-fit w-fit bg-blue-400 p-4 fixed z-100 m-4 right-0 rounded-lg  text-white flex opacity-50 cursor-pointer"
                >
                    Dev
                </button>
                <div className={`${showDev ? "block" : "hidden"}`}>
                    <div className="h-fit w-fit bg-blue-400 p-4 fixed z-100 m-4 right-0 top-36 rounded-lg font-bold text-white flex gap-4">
                        <Link href="/checkout">checkout</Link>
                        <Link href="/payment">payment</Link>
                        <Link href="/order">order</Link>
                    </div>
                    <div className="h-fit w-fit bg-red-500 p-4 fixed z-100 m-4 right-0 top-51 rounded-lg font-bold text-white">
                        <div>สิ่งที่ต้องแก้ต่อ</div>
                        <ul className="ps-4 list-decimal">
                            <li>ทำ flow สร้างสินค้า ตรวจสอบ แจ้งเตือน ประมูล [ชำระเงิน จัดส่ง]</li>
                            <li>เพิ่ม Omise payment (เพิ่ม linepay, wallet)</li>
                            <li>add session timeout</li>
                            <li>ทำ db ทดสอบ กับ bd จริง</li>
                            <li>add product เพิ่ม section ประเภทต่างๆ</li>
                            <li>ดูเรื่องความปลอดภัยข้อเว็บและ db</li>
                            <li>แก้เงื่อนไขการแสดงผล content หน้าแรก</li>
                            <li>เพิ่ม login (OTP)</li>
                            <li>ของที่หมดเวลาประมูลแล้วจะทำอะไรกับมันต่อ</li>
                            <li>เจ้าของสินค้าประมูลสินค้าตัวเองไม่ได้ใช่ไหม</li>
                            <li>ปรับ responsive และ darkmode ทุกจุด</li>
                            <li>
                                แก้ supabase alert เป็นภาษาไทย
                                (https://chatgpt.com/c/6a01fe88-8f14-83ec-ba55-c229e9d44e96)
                            </li>
                            <li>เพิ่ม llms.txt แบบ ย่อและแบบเต็ม</li>
                        </ul>
                    </div>
                </div>
            </div>
            <LandingPage />
        </div>
    );
}

export default Page;
