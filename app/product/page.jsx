import React from "react";

function Page() {
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-primary">
                            <h2 className="text-xl font-extrabold tracking-tight">Afferprice</h2>
                        </div>
                        <div className="hidden md:block">
                            <div className="relative group">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                                    <span className="material-symbols-outlined text-sm">search</span>
                                </span>
                                <input
                                    className="block w-64 pl-10 pr-3 py-2 border-slate-200 bg-slate-100 rounded-lg text-sm placeholder-slate-500 focus:ring-2 focus:ring-accent-orange focus:border-accent-orange transition-all"
                                    placeholder="ค้นหาสินค้าประมูล..."
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a className="text-sm font-semibold hover:text-accent-orange transition-colors" href="#">
                            การประมูล
                        </a>
                        <a className="text-sm font-semibold hover:text-accent-orange transition-colors" href="#">
                            หมวดหมู่
                        </a>
                        <a className="text-sm font-semibold hover:text-accent-orange transition-colors" href="#">
                            ลงขาย
                        </a>
                        <a
                            className="text-sm font-semibold hover:text-accent-orange transition-colors flex items-center gap-1"
                            href="#"
                        >
                            รายการโปรด{" "}
                            <span className="bg-accent-orange text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                3
                            </span>
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                            <img
                                alt="User Avatar"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5l3g8lNGbEZALdHZ5LztpZ5-5IivPg7GMdN5SxnEk9VwyG3TI3F57Z1Edhiqwk91ZOp-21BiwkClO-O4m4Nqlkhx7sKYJnLracF9-vMoa4SUPvmRaqiVlC_OTAcA5noY9eBDkn0f33SRzNAa8xyTED2rVlYqEGwaKer3NoHqe0QNpGiXiro4evKkX5JK368FBnu8X9afygiuXiL3g6b-ZKajSkXe8yHGEhIgOX2AvTUeCy4HF2fuT0Jhf2LC6ZbUWyR79xeD3Uoo"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <nav className="flex text-sm text-slate-500 mb-6 gap-2 items-center">
                    <a className="hover:text-accent-orange" href="#">
                        หน้าหลัก
                    </a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <a className="hover:text-accent-orange" href="#">
                        นาฬิกาหรู
                    </a>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-900 font-medium">รายละเอียดสินค้าประมูล</span>
                </nav>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-4">
                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-accent-orange text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>{" "}
                                        กำลังประมูล
                                    </span>
                                </div>
                                <img
                                    alt="Product"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCGH6QSO_u_UuEUCALibK4R2Djny2m206k0cHYhamSJmi1JlNJw9qM5-gbOmPUPKy3nMYILCqmYtyygBB_z_GevWbArnRQUEfYXsNPdow3epYJzRDcqezZv4RKUczfs6_cilcx0m5KMe5aElwiQpFPTtu65g5VSGYLhdPsz7nE_mGuFumqMMuYeIu3pzFX3VHh0FnoH9XrhvvOHSe0yp_7IQexb8ACJov3_bOB0uvoOb-nV_xa3lKoEGs02pXEV0ff82qnGcul0FA"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <button className="bg-white/90 backdrop-blur-md text-slate-900 border border-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm">
                                        <span className="material-symbols-outlined text-sm">fullscreen</span> ดูภาพขยาย
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                <div className="size-24 flex-shrink-0 rounded-lg border-2 border-accent-orange overflow-hidden">
                                    <img
                                        alt="Thumbnail 1"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGL_7URVfadW3ItT6xc9MIDfGNUtzFJsH3-7CNSBczBeqd0MEe2RD7No_pHTBBK6sRBGtqfOpV4XbkZvKfr3EzwQ4w-pWdy83nC9nI_N9GBxFrySqmRaPY7p6GiQZY2yW9bw7925_PstJgn0WxBpdyI_PhxN8VrTkIKRUvxoGTNcGao_OI-mmIfFBjzIbpZ96fTFrrb2C5VIUg2oztSqptaRP9Vly91YuV_E-jQNkcz0OMIrjubpjdUXj-DpW2UocAYZHPmjsZzOg"
                                    />
                                </div>
                                <div className="size-24 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden hover:border-accent-orange cursor-pointer transition-all">
                                    <img
                                        alt="Thumbnail 2"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlcVncwQnf7pA29tOiu0aBqyK1wMTrDg5O7UydiOgUl28WZ7UMt_kNp0eTuorPQL0gPalDDq7cINsstc1W9Gr7noSpDq-JOdOeA5OYNpHvElg1M9ySd8WUssxTuT8g7qmr4GV0zkNukNiWPbRf7JgL8r7ZL0bPVTacZuZi8dQ0M3F9JrSbxIUKI3CIvgXixAsV-rlTMUkO5deFGO4QQxGq0lv0CljtPu_g15NmWVGLlVAKB7HaC1MomoT9NMQoU87OmCXPCSyq43A"
                                    />
                                </div>
                                <div className="size-24 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden hover:border-accent-orange cursor-pointer transition-all">
                                    <img
                                        alt="Thumbnail 3"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-8TxXg6hvHu4wyJXajlM5PRNrJP_HGiKbGt_2mnjpcDJK7o0BdvFnRqbtam5RarrlwGX67Rz8Pi5GGTnZSI4nG_EMLXQaU5AeKbD4RB_HmcoDRGQePbSs1L_8WQqHTr_Byb9nGcezQscC0GLglc8BNLFlqReUw2GagKYGsNBoxxDdOF-KZUe2VbS_X640tH-MgguBgJIC9fqU25EIjxYOgeSVZDE03yR3CvX81nWbp4vwBxrvtMfDoJdXV0Z0h9laWnxu8SZBcz8"
                                    />
                                </div>
                                <div className="size-24 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden hover:border-accent-orange cursor-pointer transition-all relative">
                                    <img
                                        alt="Thumbnail 4"
                                        className="w-full h-full object-cover opacity-50"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVOXv1yV-dpfggvkBzfqzQqs-mvLZDjBbLcgn0FvmmJWOUQVtleoULZ55Wps-DTFcwHibpWLB7h5Nn2qknfWLNf7bdqHz4YlmEjoRXTBw9I_Eah_iVfHajlLgEavqorWwOXt4E2buW4kICq95QVtKCdyz-hOENaiZQ9xwYZ5L53vjqxRtAfjLwBA1yirUzqYwuXO4jVJocbam8F3lVL2UuZkimT5hJkJmx7QZ6SgQvtglUM_0J3jCIc-492vbVKobv9SSDEScR2ic"
                                    />
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
                                        +5 รูปภาพ
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm space-y-6">
                            <div>
                                <h1 className="text-3xl font-extrabold mb-4 text-primary">
                                    Luxury Professional Diver Watch - 2023 New Model
                                </h1>
                                <p className="text-slate-600 leading-relaxed">
                                    นาฬิกาดำน้ำระดับพรีเมียมรุ่นล่าสุดปี 2023 ตัวเรือนขนาด 41 มม. ผลิตจาก Oystersteel
                                    ที่ทนทาน ขอบหน้าปัดเซรามิก Cerachrom สีดำที่เป็นเอกลักษณ์ ขับเคลื่อนด้วยกลไก Calibre
                                    3235 ประสิทธิภาพสูง สินค้าอยู่ในสภาพใหม่ 100%
                                    พร้อมสติกเกอร์เดิมและกล่องอุปกรณ์ครบชุด รับประกันศูนย์ถึงปี 2028
                                </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                                        ปีที่ผลิต
                                    </p>
                                    <p className="font-semibold text-lg">2023</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                                        สภาพสินค้า
                                    </p>
                                    <p className="font-semibold text-lg text-emerald-600">ของใหม่ (Mint)</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">วัสดุ</p>
                                    <p className="font-semibold text-lg">Oystersteel</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                                        การจัดส่ง
                                    </p>
                                    <p className="font-semibold text-lg">รับประกันทั่วโลก</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">ข้อมูลผู้ขาย</h3>
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined">verified</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">ChronoElite Traders</span>
                                            <span className="bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded uppercase font-bold">
                                                Top Seller
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            สำเร็จการประมูล 4,821 ครั้ง • คะแนนบวก 99.8%
                                        </p>
                                    </div>
                                    <button className="text-sm font-semibold text-accent-orange hover:underline">
                                        ส่งข้อความ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                                <div className="p-6 bg-slate-900 text-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-slate-400 text-sm font-medium">เวลาที่เหลือ:</span>
                                        <div className="flex items-center gap-1 text-accent-orange">
                                            <span className="material-symbols-outlined text-sm">alarm</span>
                                            <span className="text-sm font-bold uppercase tracking-wider">
                                                ปิดเร็วๆ นี้
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-center gap-2">
                                        <div className="flex-1 bg-white/10 rounded-lg py-2">
                                            <span className="block text-2xl font-black text-accent-orange">04</span>
                                            <span className="text-[10px] text-slate-400 uppercase">ชั่วโมง</span>
                                        </div>
                                        <div className="flex-1 bg-white/10 rounded-lg py-2">
                                            <span className="block text-2xl font-black text-accent-orange">21</span>
                                            <span className="text-[10px] text-slate-400 uppercase">นาที</span>
                                        </div>
                                        <div className="flex-1 bg-white/10 rounded-lg py-2">
                                            <span className="block text-2xl font-black text-accent-orange">38</span>
                                            <span className="text-[10px] text-slate-400 uppercase">วินาที</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <p className="text-slate-500 text-sm font-medium mb-1">ราคาประมูลปัจจุบัน</p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-4xl font-extrabold text-primary">฿498,750</h2>
                                            <span className="text-emerald-600 text-sm font-bold flex items-center">
                                                <span className="material-symbols-outlined text-sm">trending_up</span>{" "}
                                                +฿17,500
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">
                                            ถึงราคาขั้นต่ำแล้ว • ผู้ประมูลรวม 24 ราย
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            <button className="py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors">
                                                +฿3,500
                                            </button>
                                            <button className="py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors">
                                                +฿17,500
                                            </button>
                                            <button className="py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors">
                                                +฿35,000
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold">
                                                ฿
                                            </span>
                                            <input
                                                className="block w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-xl font-bold focus:border-accent-orange focus:ring-0 transition-all"
                                                placeholder="516,250"
                                                type="number"
                                            />
                                        </div>
                                        <button className="w-full bg-accent-orange hover:bg-orange-600 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2">
                                            วางประมูลทันที
                                            <span className="material-symbols-outlined">gavel</span>
                                        </button>
                                        <div className="flex flex-col gap-2 text-[10px] text-slate-400 font-medium text-center">
                                            <span className="flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-sm text-blue-500">
                                                    verified_user
                                                </span>{" "}
                                                รับประกันสินค้าแท้ 100%
                                            </span>
                                            <span className="flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-sm text-blue-500">
                                                    lock
                                                </span>{" "}
                                                ชำระเงินปลอดภัยและมีระบบคุ้มครอง
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> ประวัติการประมูล
                                    </h3>
                                    <span className="text-xs text-slate-400">อัปเดตล่าสุด: เมื่อครู่</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                JD
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">j***n.eth</p>
                                                <p className="text-[10px] text-slate-400 uppercase">2 นาทีที่แล้ว</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-extrabold text-emerald-600">฿498,750</p>
                                            <p className="text-[10px] text-emerald-600 font-medium">ผู้นำประมูล</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold">
                                                AM
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">a***x_m</p>
                                                <p className="text-[10px] text-slate-400 uppercase">14 นาทีที่แล้ว</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-400">฿481,250</p>
                                            <p className="text-[10px] text-slate-400">ถูกประมูลแซง</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">
                                                W9
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">w***992</p>
                                                <p className="text-[10px] text-slate-400 uppercase">22 นาทีที่แล้ว</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-400">฿463,750</p>
                                            <p className="text-[10px] text-slate-400">ถูกประมูลแซง</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-2 text-xs font-bold text-slate-400 hover:text-accent-orange transition-colors">
                                    ดูประวัติทั้งหมด 24 รายการ
                                </button>
                            </div>
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 border-l-4 border-l-blue-500">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-500">insights</span>
                                    <div>
                                        <h4 className="font-bold text-sm text-blue-900">ข้อมูลเชิงลึกจากตลาด</h4>
                                        <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                                            รุ่นนี้กำลังเป็นที่นิยม +12.4% เหนือราคาป้าย
                                            สินค้าที่คล้ายกันประมูลไปในราคาสูงสุดเฉลี่ยที่ ฿577,500 ในไตรมาสนี้
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="mt-20 border-t border-slate-200 py-12 bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 space-y-4">
                            <div className="flex items-center gap-2 text-white">
                                <span className="material-symbols-outlined text-accent-orange">token</span>
                                <h2 className="text-xl font-extrabold tracking-tight">Afferprice</h2>
                            </div>
                            <p className="text-sm leading-relaxed">
                                แพลตฟอร์มประมูลสินค้าหรูชั้นนำระดับโลก มั่นใจได้ด้วยระบบตรวจสอบความถูกต้องแบบเรียลไทม์
                            </p>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-white font-bold mb-4">แพลตฟอร์ม</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        การประมูลสด
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        สินค้าใหม่เร็วๆ นี้
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        ขั้นตอนการตรวจสอบ
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        ค่าธรรมเนียม
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-white font-bold mb-4">ช่วยเหลือ</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        ศูนย์ช่วยเหลือ
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        การคุ้มครองผู้ซื้อ
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        คู่มือการขาย
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-accent-orange transition-colors" href="#">
                                        ติดต่อเรา
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-1">
                            <h4 className="text-white font-bold mb-4">ข่าวสาร</h4>
                            <p className="text-sm mb-4">รับข่าวสารเกี่ยวกับสินค้าหายากก่อนใคร</p>
                            <div className="flex gap-2">
                                <input
                                    className="bg-slate-800 border-none rounded-lg text-sm w-full focus:ring-1 focus:ring-accent-orange"
                                    placeholder="อีเมลของคุณ"
                                    type="email"
                                />
                                <button className="bg-accent-orange px-4 py-2 rounded-lg text-white font-bold text-sm">
                                    ติดตาม
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>© 2023 Afferprice Global Inc. สงวนลิขสิทธิ์.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-white" href="#">
                                นโยบายความเป็นส่วนตัว
                            </a>
                            <a className="hover:text-white" href="#">
                                เงื่อนไขการให้บริการ
                            </a>
                            <a className="hover:text-white" href="#">
                                นโยบายคุกกี้
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Page;
