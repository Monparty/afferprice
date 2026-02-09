import React from "react";

function Page() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <div className="h-fit w-fit bg-red-500 p-4 fixed z-100 m-4 right-0 rounded-lg font-bold text-white">
                <div>สิ่งที่ต้องแก้ต่อ</div>
                <ul className="ps-1">
                    <li>- add หน้า notification</li>
                    <li>- add mui</li>
                    <li>- refactor className</li>
                    <li>- ทำ mock navbar ทุกหน้าที่มี</li>
                    <li>- ใช้ tag Link แทน a</li>
                </ul>
            </div>
            <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 bg-white/90 backdrop-blur-md px-4 md:px-10 py-3">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 text-primary">
                            <div className="flex items-center justify-center size-10 bg-primary rounded-lg text-white">
                                <span className="material-symbols-outlined">
                                    gavel
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold leading-tight tracking-tight">Afferprice</h1>
                        </div>
                        <nav className="hidden lg:flex items-center gap-8">
                            <a className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" href="#">
                                การประมูล
                            </a>
                            <a className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" href="#">
                                หมวดหมู่
                            </a>
                            <a className="text-slate-600 hover:text-primary text-sm font-medium transition-colors" href="#">
                                เกี่ยวกับเรา
                            </a>
                            <a
                                className="text-primary hover:text-accent-orange text-sm font-bold transition-colors"
                                href="#"
                            >
                                ลงขายสินค้า
                            </a>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-md w-full relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input
                                className="w-full h-full pl-10 pr-4 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 bg-slate-50 placeholder:text-slate-400 text-sm font-normal"
                                placeholder="ค้นหาสินค้าหรู..."
                                // value=""
                            />
                        </label>
                        <div className="flex items-center gap-3">
                            <button className="hidden sm:flex items-center justify-center px-6 h-10 bg-primary text-white rounded-lg text-sm font-bold tracking-wide hover:bg-primary/90 transition-all">
                                เชื่อมต่อวอลเล็ท
                            </button>
                            <div className="h-10 w-10 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer">
                                <img
                                    alt="User profile"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjE8PHheM37Ar2El9eg52Hfz6pZirpH5JOWmlQFjB5Jy5gPZWuq7J_KHd52SPrp1wTXGQ6h7D2CVanpnt8kcI39RyFi9je3Xqp6POGI8rN0WAC0ioPdvExEAH_95V1-DujLc_UGNwdifW5URAOORBkY0hU0rA9IITFvG92of3ZrXq_3vsJsPaJO1y0YLTFscKcPVUSIOjOGbTOdGM7Xcjy9JyfW1vbSnCQtyo8QfxaV-63Y716NKeteHMx98ju-7kCE5oml7hoyoM"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="flex size-2 rounded-full bg-red-500 animate-pulse"></span>
                            <h2 className="text-2xl font-bold tracking-tight">ประมูลสดตอนนี้</h2>
                        </div>
                        <a className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline" href="#">
                            ดูทั้งหมด <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                        <div className="flex-none w-[350px] md:w-[600px] h-[350px] relative rounded-xl overflow-hidden group">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCBFFj5qKrhsgZaW4AzQ_39biUd9UTvQhlvmqAV33C_Y_uNotow8H2jfrW8lPgYyNGh7ivKNr5iu2qyWYqaQczd9H4wahNqtKyBy1CSaRyXUfip3LgJJNAJn9vWYAoo0_F5YjaK_2a17lbG2urdICZowkJaJtMoZOTyZVC369t86-m--x1cp7NGuLwbOnYxGEbfw-p7iv22xVcUuyoaEJCUE3DZq7rTtKPkdoVlAOXpXg_0RM_eInAHek0pJAQ_7r265ZYWnEgcA3I')"}}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="px-2 py-1 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-widest">
                                        แนะนำ
                                    </span>
                                    <h3 className="text-white text-2xl font-bold">นาฬิกาสุดหรู รุ่นซับมาริเนอร์ สีดำเงา</h3>
                                    <div className="flex items-center gap-3 text-white/90">
                                        <p className="text-lg font-medium">
                                            ราคาปัจจุบัน: <span className="text-white font-bold">450,000 บาท</span>
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">24 การประมูล</span>
                                    </div>
                                </div>
                                <button className="bg-accent-orange text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg">
                                    เข้าร่วมประมูล
                                </button>
                            </div>
                        </div>
                        <div className="flex-none w-[350px] md:w-[600px] h-[350px] relative rounded-xl overflow-hidden group">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB50U5YwdcaSTPsjHY8QJ6UmOwP-HyNL04F4fg71X_tIm0o5fy5P8d8YKx8mM9myGAY1uLERkXnt164d405TM4OhAO7yqrOySDq-7UcgtRJH-FyT3_q2rChpwbuyHJmUveg10fUH0YqAeqwfHb_OFWxcTsPcsklNkX0NBYfPf0VAqrQXfM4Y1ZEirScuqq_p8viJRp38EG2VufZKAFzt03McNNlXvAclqYOMQClSR5XSs8vtT6SmaO8R9iIK5OomEtcXvcG4W_fog0')"}}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded uppercase tracking-widest">
                                        กำลังจะจบ
                                    </span>
                                    <h3 className="text-white text-2xl font-bold">รถคลาสสิก วินเทจ 1967 สภาพสมบูรณ์</h3>
                                    <div className="flex items-center gap-3 text-white/90">
                                        <p className="text-lg font-medium">
                                            ราคาปัจจุบัน: <span className="text-white font-bold">4,900,000 บาท</span>
                                        </p>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">58 การประมูล</span>
                                    </div>
                                </div>
                                <button className="bg-accent-orange text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors shadow-lg">
                                    เข้าร่วมประมูล
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <nav className="mb-10 border-b border-slate-200">
                    <div className="flex overflow-x-auto gap-10 no-scrollbar">
                        <a
                            className="flex flex-col items-center gap-2 pb-4 border-b-2 border-primary text-primary min-w-max"
                            href="#"
                        >
                            <span className="material-symbols-outlined">
                                watch
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest">นาฬิกา</span>
                        </a>
                        <a
                            className="flex flex-col items-center gap-2 pb-4 border-b-2 border-transparent text-slate-400 hover:text-primary min-w-max transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">laptop_mac</span>
                            <span className="text-xs font-bold uppercase tracking-widest">อิเล็กทรอนิกส์</span>
                        </a>
                        <a
                            className="flex flex-col items-center gap-2 pb-4 border-b-2 border-transparent text-slate-400 hover:text-primary min-w-max transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">palette</span>
                            <span className="text-xs font-bold uppercase tracking-widest">ศิลปะ</span>
                        </a>
                        <a
                            className="flex flex-col items-center gap-2 pb-4 border-b-2 border-transparent text-slate-400 hover:text-primary min-w-max transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">directions_car</span>
                            <span className="text-xs font-bold uppercase tracking-widest">รถยนต์</span>
                        </a>
                        <a
                            className="flex flex-col items-center gap-2 pb-4 border-b-2 border-transparent text-slate-400 hover:text-primary min-w-max transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">diamond</span>
                            <span className="text-xs font-bold uppercase tracking-widest">จิวเวลรี่</span>
                        </a>
                        <a
                            className="flex flex-col items-center gap-2 pb-4 border-b-2 border-transparent text-slate-400 hover:text-primary min-w-max transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">home_iot_device</span>
                            <span className="text-xs font-bold uppercase tracking-widest">อสังหาริมทรัพย์</span>
                        </a>
                    </div>
                </nav>
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">การประมูลยอดนิยม</h2>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-sm">filter_list</span>
                            </button>
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                                <span className="material-symbols-outlined text-sm">grid_view</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="relative aspect-square">
                                <img
                                    alt="นาฬิกาหรู"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOkV3_tMtPQoqrdr5RvWu1EOww1XkxtgwCGbFm1y2M9v-DAgwwt0zhKK26nDPNe2M2N8ItDy3odvDww1Hm1rxjIGkvitlqPqPD_K6xVZYKfgvwUAuJGYWUQu1fxPnWHx7bFcasneqHnjL-LNYkld-IoNU1NN4QYObUilZ4ByUwVEeE4u4e8-n_gO8HjRvDpwMkRAkLYmpXUzMKhAiaaDXZ5fPHX_h7nTmoR8dLArSWuoJqpWjDLIy69dnMsAjstO_iG5OiBoaO5uc"
                                />
                                <div className="absolute top-3 right-3">
                                    <button className="size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-accent-orange text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    02:45:12
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        นาฬิกา
                                    </p>
                                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                        โอเมก้า สปีดมาสเตอร์
                                    </h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary">185,000 บาท</span>
                                        <span className="text-xs text-slate-400">12 ประมูล</span>
                                    </div>
                                </div>
                                <button className="mt-auto w-full bg-accent-orange py-2.5 rounded-lg text-sm font-bold text-white hover:bg-orange-600 transition-all">
                                    เสนอราคาประมูล
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="relative aspect-square">
                                <img
                                    alt="แล็ปท็อป"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpd19gnQ3xYspEtUu2cdv1jFZqlbdbgzFQyUz1OK4ju5e9RX4cfXUb5myAl2W4Pq3CtXt3613zIo8gLgRyvMYSR3NnUlZejzMYz79a7YJ-x0DCGWX1-R4U3ID_-x58Mq6hpDHKvO-oYGvM5D1MpAaO6YOuoPG4Xjr2EjSSc_CgXF0jsL3hHHwWXJYtMBDx8inJMGSRaGY3rYkn7cd0oIgWjPqhB9F5XdmmOEmkiPQu5EMGfcVztwu4Wn7NC_tqB_4knMoqtzCyp5k"
                                />
                                <div className="absolute top-3 right-3">
                                    <button className="size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-accent-orange text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    00:15:30
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        อิเล็กทรอนิกส์
                                    </p>
                                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                        แมคบุ๊ค โปร M3 Max 16 นิ้ว
                                    </h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary">75,000 บาท</span>
                                        <span className="text-xs text-slate-400">45 ประมูล</span>
                                    </div>
                                </div>
                                <button className="mt-auto w-full bg-accent-orange py-2.5 rounded-lg text-sm font-bold text-white hover:bg-orange-600 transition-all">
                                    เสนอราคาประมูล
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="relative aspect-square">
                                <img
                                    alt="กล้อง"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7KmVEY3Ikig6_SnKkn9VIe-5-7WZQxnSRyAKDWr2q8zwePOEqrg5KUNcv8Dm3GH-G1asbDktjckcBpUMOz-DT1xRIMAfkkUeymH6N2WdX_4FWVH5rRTwWXwF7IO--7vBSKDWKZ6Titq5aFiqjmhuQH4Ea8ZpMpnP6_IslFdi7QqfZs_JfgoXoW5oSjRCxFf_f8S554N6xz6dytK7fVQaBPcecHvvt8UaVnn02fONYylZq4cwm1dxGkrsOxN6pVHPl30IcT7qYLsA"
                                />
                                <div className="absolute top-3 right-3">
                                    <button className="size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-accent-orange text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    05:22:10
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        อิเล็กทรอนิกส์
                                    </p>
                                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                        กล้องไรก้า M11 ไดจิตัล
                                    </h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary">240,000 บาท</span>
                                        <span className="text-xs text-slate-400">8 ประมูล</span>
                                    </div>
                                </div>
                                <button className="mt-auto w-full bg-accent-orange py-2.5 rounded-lg text-sm font-bold text-white hover:bg-orange-600 transition-all">
                                    เสนอราคาประมูล
                                </button>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className="relative aspect-square">
                                <img
                                    alt="ภาพวาด"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXlKlFNpWGuvM15RYs6LZYnoVBP30D9RMgG1cOLcwMJWK5Gku1uha-gS1_Vjyzm2Bp5awq4I8QKAJ2aJb75U24df_hql4aRxeMSSUerdjZ3oYFNQ5PR6wdWcFF8oKpe33K-1gubeT-Xu2xpyjoigaXQOMUqZ8ioZLLnfcFtFhB37HCE-KBxCj6vXdGXJOldG96bIKt0-Bf6YGYqWupvBG4b_g1AJXlVbf8HjTdU2G3WjME0kRaLhnJLuNZ5e9pcBTRnV31PXokZhk"
                                />
                                <div className="absolute top-3 right-3">
                                    <button className="size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-accent-orange text-white px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 shadow-lg">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    01:10:45
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ศิลปะ</p>
                                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                        ภาพวาดสีน้ำมันแนวแอ็บสแตรกต์
                                    </h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-primary">150,000 บาท</span>
                                        <span className="text-xs text-slate-400">31 ประมูล</span>
                                    </div>
                                </div>
                                <button className="mt-auto w-full bg-accent-orange py-2.5 rounded-lg text-sm font-bold text-white hover:bg-orange-600 transition-all">
                                    เสนอราคาประมูล
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="mt-12 bg-slate-50 border-t border-slate-200 py-10">
                <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 text-primary mb-6">
                                <div className="flex items-center justify-center size-8 bg-primary rounded-lg text-white">
                                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                                </div>
                                <h2 className="text-lg font-bold">Afferprice</h2>
                            </div>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                แพลตฟอร์มประมูลสินค้าหรูแบบเรียลไทม์ที่ได้รับความไว้วางใจที่สุดในโลก
                                ผู้ขายได้รับการยืนยัน การชำระเงินที่ปลอดภัย และการจัดส่งทั่วโลก
                            </p>
                            <div className="flex gap-4">
                                <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined">public</span>
                                </a>
                                <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined">alternate_email</span>
                                </a>
                                <a className="text-slate-400 hover:text-primary transition-colors" href="#">
                                    <span className="material-symbols-outlined">share</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-900">การประมูล</h3>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        ประมูลสดตอนนี้
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        กำลังจะจบ
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        ขายแล้วล่าสุด
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        รายการเร็วๆ นี้
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-900">บริษัท</h3>
                            <ul className="space-y-3 text-sm text-slate-500">
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        เกี่ยวกับเรา
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        ผู้ขายที่ได้รับการรับรอง
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        ความปลอดภัย
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-primary transition-colors" href="#">
                                        ศูนย์ช่วยเหลือ
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-900">รับข่าวสาร</h3>
                            <p className="text-sm text-slate-500 mb-4">
                                รับการแจ้งเตือนเกี่ยวกับการประมูลสินค้ามูลค่าสูงที่จะเกิดขึ้น
                            </p>
                            <form className="flex flex-col gap-2">
                                <input
                                    className="bg-white border border-slate-200 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="อีเมลของคุณ"
                                    type="email"
                                />
                                <button className="bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all">
                                    ติดตามข่าวสาร
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-slate-400">© 2024 Afferprice Inc. สงวนลิขสิทธิ์ทั้งหมด</p>
                        <div className="flex gap-6 text-xs text-slate-400">
                            <a className="hover:underline" href="#">
                                นโยบายความเป็นส่วนตัว
                            </a>
                            <a className="hover:underline" href="#">
                                เงื่อนไขการให้บริการ
                            </a>
                            <a className="hover:underline" href="#">
                                นโยบายคุกกี้
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Page;
