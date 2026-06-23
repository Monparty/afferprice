"use client";
import { SettingOutlined } from "@ant-design/icons";

function Page() {
    const groups = [
        {
            title: "ค่าธรรมเนียม",
            items: [
                { label: "ค่าธรรมเนียมขาย", value: "5%" },
                { label: "ค่าธรรมเนียมลงประกาศ", value: "—" },
            ],
        },
        {
            title: "การประมูล",
            items: [
                { label: "ระยะเวลาเริ่มต้น", value: "ตามที่ผู้ขายกำหนด" },
                { label: "Auto end", value: "Client-trigger เมื่อหมดเวลา" },
            ],
        },
        {
            title: "การชำระเงิน",
            items: [
                { label: "ช่องทาง", value: "PromptPay, LINE Pay (mock), Wallet (mock), Credit Card" },
                { label: "Webhook", value: "/api/payment/webhook" },
            ],
        },
        {
            title: "ระบบ",
            items: [
                { label: "Inactivity logout", value: "2 ชั่วโมง" },
                { label: "Locale", value: "th_TH" },
            ],
        },
    ];

    return (
        <main className="grid gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex items-center gap-3">
                <SettingOutlined className="text-2xl! text-slate-400" />
                <div>
                    <h2 className="font-bold">การตั้งค่าระบบ</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">หน้าตั้งค่ายังเป็นแบบอ่านอย่างเดียว — แก้ไขได้ภายหลัง</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groups.map((g) => (
                    <div key={g.title} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold">{g.title}</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {g.items.map((it) => (
                                <div key={it.label} className="px-6 py-3 flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">{it.label}</span>
                                    <span className="font-medium">{it.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

export default Page;
