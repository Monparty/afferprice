"use client";
import Link from "next/link";
import { useState } from "react";
import LandingPage from "./components/utils/LandingPage";

function Page() {
    const [showDev, setShowDev] = useState(false);

    return (
        <div className="w-full max-w-360 mx-auto px-4 md:px-10 py-6">
            <div>
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
                            <li>ใช้ tag Link แทน a</li>
                            <li>ใช้ Image แทน img</li>
                            <li>เพิ่ม Omise payment</li>
                            <li>ทำ responsive</li>
                            <li>เพิ่ม login (OTP)</li>
                            <li>เพิ่ม หน้าสำหรับ admin</li>
                            <li>เพิ่ม กล่องแชท</li>
                            <li>เพิ่ม รายละเอียดหน้าแรก</li>
                            <li>add product เพิ่ม section ประเภทต่างๆ</li>
                            <li>ทำระบบ noti</li>
                        </ul>
                    </div>
                </div>
            </div>
            <LandingPage />
        </div>
    );
}

export default Page;
