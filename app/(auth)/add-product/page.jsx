import React from "react";

function Page() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-10 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-primary">
                        <h2 className="text-xl font-bold leading-tight tracking-tight font-display">Afferprice</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a className="text-slate-600 text-sm font-medium hover:text-accent transition-colors" href="#">
                            แดชบอร์ด
                        </a>
                        <a className="text-slate-600 text-sm font-medium hover:text-accent transition-colors" href="#">
                            รายการประมูล
                        </a>
                        <a className="text-accent text-sm font-bold border-b-2 border-accent pb-1" href="#">
                            ลงขายสินค้า
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
                        <img
                            alt="User profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcyzXUOgPw1d0nhp0WUSinmun0xpXZChESjWzpZ6P6Kqs7TI7igMXNO59mlzkiDnqPmZFjMDldu6-i0OEQbN43u9XlO8pxTjq9sJz2QuxjO3WyWAfWGclqGTMo0_N59RaQ1YU11nTe5j7omLFXeTlkA8vDcgRNAuKzol_yOtXFzoiv9hu6G2sU6ej9Pzv322hBmyEXevNbqwSNhMd-VjBHi9k0lYRAqvfDQ27iqNYKha5RSVTQMUDFEUlqHv8K1R33VF91NkjhUEw"
                        />
                    </div>
                </div>
            </header>
            <main className="flex-1 flex justify-center py-10 px-4">
                <div className="max-w-[1000px] w-full flex flex-col gap-8">
                    <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-accent">ขั้นตอนที่ 1 จาก 3</span>
                                <span className="text-sm text-slate-400">•</span>
                                <span className="text-sm font-medium text-slate-600">อัปโหลดรูปภาพ</span>
                            </div>
                            <span className="text-sm font-medium text-slate-400">สำเร็จแล้ว 33%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-accent transition-all duration-500 w-[33%] bg-blue-500"></div>
                        </div>
                        <div className="grid grid-cols-3 mt-6 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-bold text-sm">
                                    1
                                </div>
                                <span className="text-sm font-bold text-slate-900">รูปภาพ</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-sm">
                                    2
                                </div>
                                <span className="text-sm font-medium">รายละเอียดสินค้า</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 font-bold text-sm">
                                    3
                                </div>
                                <span className="text-sm font-medium">การตั้งค่าประมูล</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-accent">add_a_photo</span>
                                        อัปโหลดรูปภาพ
                                    </h2>
                                    <p className="text-slate-500 text-sm mt-1">
                                        รูปภาพคุณภาพสูงจะช่วยเพิ่มโอกาสในการขายได้ถึง 40%
                                    </p>
                                </div>
                                <div className="flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
                                    <div className="flex flex-col items-center text-center p-8">
                                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-accent text-4xl">
                                                cloud_upload
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">ลากและวางรูปภาพที่นี่</h3>
                                        <p className="text-slate-500 text-sm mt-2 max-w-xs">
                                            สามารถอัปโหลดได้สูงสุด 12 รูป รองรับไฟล์ JPEG, PNG และ HEIC
                                        </p>
                                        <button className="mt-6 px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                                            เลือกไฟล์จากเครื่อง
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-6">
                                    <div className="aspect-square rounded-lg border border-slate-200 overflow-hidden relative group">
                                        <img
                                            alt="Product preview"
                                            className="w-full h-full object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBskURA1I1sb-Zh01TRgC7l_QkE-W4ARvcB-oejB9X0qJkgReHXgnB80B_s0JHlpuJPJjxCb4q2wILh1YeTUo9Sb0dnIG_LNgmdJ68WaBL2fhg_-TEKE8welPNNg901dXyXui8pmyxnsN3ukvjMTC3xhGbUeFQaj7cZNe4QcpAqdkxFDMemN4c2JOIrRyCD98XrgJEz9--92gxq9bGhTxu5Q4LOULCqehSvDXOXWmVcF57bGxFlva-TCImZ9KZSDhp875pmLeD0OTQ"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="material-symbols-outlined text-white cursor-pointer hover:text-red-400">
                                                delete
                                            </span>
                                        </div>
                                        <div className="absolute bottom-1 left-1 bg-accent text-[10px] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                            รูปหลัก
                                        </div>
                                    </div>
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-accent hover:text-accent transition-colors">
                                        <span className="material-symbols-outlined">add</span>
                                    </div>
                                </div>
                            </section>
                            <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-slate-900 mb-6">การตั้งค่าประมูล</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700">ราคาเริ่มต้น (บาท)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                                ฿
                                            </span>
                                            <input
                                                className="w-full bg-slate-50 border-slate-200 rounded-lg focus:ring-accent focus:border-accent text-slate-900 pl-8 py-3"
                                                placeholder="0.00"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-700">ระยะเวลาการประมูล</label>
                                        <select className="w-full bg-slate-50 border-slate-200 rounded-lg focus:ring-accent focus:border-accent text-slate-900 py-3">
                                            <option>3 วัน</option>
                                            <option>5 วัน</option>
                                            <option selected="">7 วัน</option>
                                            <option>10 วัน</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg sticky top-24">
                                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        ตัวอย่างการแสดงผล
                                    </span>
                                    <span className="material-symbols-outlined text-slate-400 text-sm">visibility</span>
                                </div>
                                <div className="aspect-video w-full bg-slate-100 relative">
                                    <img
                                        alt="Product preview"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC921Y5c16lE3ZMlaoy6xolPn0zfdw8gQ7IhtehHzvuwLAS92azbeaanRX37tIMm2AGX7oEMVCTbykL4Ckr1W_dQqsJIDkrxlNeQztkgrFlxh0lKa11D2lR73i5ZECD7v0bs7Gh0KbhDSSe79C3UPAReOuUR8xJ9nfOL7iIhXE1LeyJtLiNP34IcGV_XpyiyenoOExCdg0QOQDvT5tFimVFJIlQYqKA9MHXBZNfBxqss7zEPM3W-FQOtGgTBbgPDYlHi5IURJ5n8ik"
                                    />
                                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase italic">
                                        กำลังเริ่มเร็วๆ นี้
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-slate-900 truncate">
                                        ชื่อรายการสินค้าของคุณจะแสดงที่นี่...
                                    </h3>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">ราคาเริ่มต้น</p>
                                            <p className="text-xl font-black text-primary">฿0</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">เวลาที่เหลือ</p>
                                            <p className="text-sm font-bold text-slate-900">-- : -- : --</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 border border-white"></div>
                                        <span className="text-xs font-medium text-slate-500">ผู้ขาย: บัญชีของคุณ</span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col gap-3 bg-slate-50">
                                    <button className="w-full py-3 bg-accent text-white rounded-lg font-bold text-sm shadow-md shadow-accent/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                                        ดำเนินการต่อ
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                    <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all">
                                        บันทึกเป็นฉบับร่าง
                                    </button>
                                    <p className="text-[11px] text-center text-slate-400 px-4 leading-relaxed">
                                        ในการดำเนินการต่อ คุณยอมรับนโยบายผู้ขายและโครงสร้างค่าธรรมเนียมของเรา
                                    </p>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-lg">verified_user</span>
                                    Afferprice การันตีความปลอดภัย
                                </h4>
                                <ul className="flex flex-col gap-3">
                                    <li className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-base">
                                            check_circle
                                        </span>
                                        <span className="text-[12px] text-slate-600">
                                            ระบบ Escrow คุ้มครองการชำระเงินสำหรับสินค้ามูลค่าสูง
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-base">
                                            check_circle
                                        </span>
                                        <span className="text-[12px] text-slate-600">
                                            สร้างใบปะหน้าพัสดุอัตโนมัติเมื่อมีการชำระเงิน
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-base">
                                            check_circle
                                        </span>
                                        <span className="text-[12px] text-slate-600">
                                            ทีมงานสนับสนุนข้อพิพาทโดยเฉพาะตลอด 24 ชม.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <button className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm">ฉบับร่าง</button>
                <button className="flex-[2] py-3 bg-accent text-white rounded-lg font-bold text-sm">ถัดไป</button>
            </footer>
        </div>
    );
}

export default Page;
