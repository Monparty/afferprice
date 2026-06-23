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
                        <ul className="ps-4 list-decimal">
                            <li>ทำ flow สร้างสินค้า ตรวจสอบ แจ้งเตือน ประมูล [ชำระเงิน จัดส่ง]</li>
                            <li>ตัวเลขเวลานับถอยหลังใน Card ต้องนับถอยหลังแบบ realtime</li>
                            <li>ทำระบบเติมเงินไว้ให้ user เก็บเงินในเว็บผ่าน Omise (ทำแล้วยังไม่ผูกกับ Omise)</li>
                            <li>ทำ db ทดสอบ กับ bd จริง</li>
                            <li>แก้เงื่อนไขการแสดงผล content หน้าแรก</li>
                            <li>เพิ่ม login (OTP)</li>
                            <li>ปรับ responsive ทุกจุด</li>
                            <li>เพิ่มการแจ้งเตือน สินค้ารออนุมัติ และ อนุมัติ KYC ให้ admin (เป็นตัวเลขแสดงที่ menu sitebar)</li>

                            {/* <li>1 เมื่อผู้ซื้อชำระเงินแล้ว ผู้ขายเห็นหน้า /user/checkout/ เป็นรายละเอียดของผู้ซื้อ เปลี่ยนจากปุ่ม ชำระเป็น ระบุเลขใบเสร็จการจัดส่ง</li> */}
                            {/* <li>2 เมื่อ ระบุเลขใบเสร็จการจัดส่ง แล้ว state ของสินค้าที่ทั้ง ผู้ซื้อ ผู้ขายเห็น จะเป็น อยู่ระหว่างจัดส่ง</li> */}
                            <li>3 เมื่อจัดส่งสำเร็จ ผู้ซื้อกดปุ่มได้รับสินค้า และบันทึก VDO สินค้าภายใน 48 ชม.</li>
                            <li>4 เมื่อทุกอย่างเรียบร้อย สถานะเปลี่ยนเป็น จัดส่งสำเร็จ</li>
                            <li>ครั้งแรกที่สร้าง user ใหม่ และสร้างสินค้า บันทึกสินค้าครั้งแรกพร้อม kyc สถานนะไม่เปลี่ยนจาก draf เป็น รอตรวจสอบ</li>
                        </ul>
                    </div>
                </div>
            </div>
            <LandingPage />
        </div>
    );
}

export default Page;
