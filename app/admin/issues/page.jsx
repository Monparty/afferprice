"use client";
import { ExceptionOutlined } from "@ant-design/icons";

function Page() {
    return (
        <main className="grid gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center gap-3 text-center">
                <ExceptionOutlined className="text-5xl! text-slate-300" />
                <h2 className="text-xl font-bold">ระบบแจ้งปัญหา</h2>
                <p className="text-slate-500 text-sm max-w-md">
                    ยังไม่มีตาราง issues ในฐานข้อมูล — เมื่อเพิ่ม schema และ service แล้ว
                    หน้านี้จะใช้แสดงรายการปัญหาที่ผู้ใช้แจ้งเข้ามา (เช่น สินค้าไม่ตรง, ผู้ขายไม่ส่ง, การชำระเงิน)
                </p>
            </div>
        </main>
    );
}

export default Page;
