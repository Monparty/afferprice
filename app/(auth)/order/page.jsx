import React from "react";

function Page() {
    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                {/* <!-- Navigation Bar --> */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 md:px-10 lg:px-40 py-3 sticky top-12 z-50">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 text-primary">
                            <div className="size-8">
                                <svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        clip-rule="evenodd"
                                        d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                                        fill="currentColor"
                                        fill-rule="evenodd"
                                    ></path>
                                    <path
                                        clip-rule="evenodd"
                                        d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                                        fill="currentColor"
                                        fill-rule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                                Afferprice
                            </h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-9">
                            <a
                                className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
                                href="#"
                            >
                                หน้าแรก
                            </a>
                            <a
                                className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
                                href="#"
                            >
                                การประมูลของฉัน
                            </a>
                            <a
                                className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
                                href="#"
                            >
                                ข้อความ
                            </a>
                            <a
                                className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
                                href="#"
                            >
                                แจ้งเตือน
                            </a>
                        </nav>
                    </div>
                    <div className="flex flex-1 justify-end gap-4 items-center">
                        <label className="hidden lg:flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-slate-200 dark:border-slate-700">
                                <div className="text-slate-400 flex bg-slate-50 dark:bg-slate-800 items-center justify-center pl-4 rounded-l-lg">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-0 h-full placeholder:text-slate-400 px-4 rounded-r-lg text-sm"
                                    placeholder="ค้นหาสินค้าหรือหมายเลขติดตาม"
                                    value=""
                                />
                            </div>
                        </label>
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                            <img
                                className="w-full h-full object-cover"
                                data-alt="User profile avatar"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBll_W1ZpPDL8dogfKPlYbiNAVxiqzxXulM_DH9Se3cYeLOo5Jwy3tRyeZQaKj38zwW8CXvy0PdvWgCiDynDHwrMsf4w0R5r9Zycv8sJe5sPJcYxVmDqRY8wA2hmCqxQ5slXhQR8GAu10L2F0P3rcscd08o9YXWn6eUosYphxueyb8y2pf3eMi-XKiyrQqvDVKKEp9k5st23Nkm1C19LkwwKzjsSEIDLCTe8m3fgVuQu-iOWHvbBmxoXr_7mZM-XOwUnouGxQOjlyo"
                            />
                        </div>
                    </div>
                </header>
                {/* <!-- Content Area --> */}
                <main className="flex-1 flex justify-center py-8 px-4 sm:px-10">
                    <div className="layout-content-container flex flex-col max-w-[800px] w-full gap-6">
                        {/* <!-- Breadcrumbs --> */}
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <a className="text-slate-500 hover:text-primary" href="#">
                                หน้าแรก
                            </a>
                            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
                            <a className="text-slate-500 hover:text-primary" href="#">
                                ประวัติการประมูล
                            </a>
                            <span className="material-symbols-outlined text-slate-400 text-[16px]">chevron_right</span>
                            <span className="text-slate-900 dark:text-white font-semibold">ติดตามสถานะการจัดส่ง</span>
                        </div>
                        {/* <!-- Title Section --> */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
                                ติดตามสถานะการจัดส่ง
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400">หมายเลขคำสั่งซื้อ: #BD-987654321</p>
                        </div>
                        {/* <!-- Top Card: Item & Tracking Info --> */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-48 aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="Luxury Rolex Submariner watch on display"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFhOc1y_raxsIi9KyptLVWbJxrqAzGS0agWaQy93L0krh_2-OLG9IkTw-clZfgl2JxlTvEI6n0n-eVJWHawLz-2b6Tzp-YDZuD7C55s4LH6J6bhJA8o-D_KWp15S2tY3cPT_PfupXw_IwomjG5zxjmisEoM09wVCVK4Mql0Wck--bV8W9_qkD5iL9Nwfhnw1GD0M2ucydVI3mTqE725rW7R_9iInb-1riyV8AqQywxF6hWVItS_0Vf3603-Rj5VrpJOEfEbMsz6wU"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between h-full py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                                                    รายการสินค้าที่คุณชนะ
                                                </p>
                                                <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-2">
                                                    Rolex Submariner Date 126610LN
                                                </h3>
                                            </div>
                                            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                                                กำลังดำเนินการ
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                            ราคาชนะประมูล:{" "}
                                            <span className="text-slate-900 dark:text-white font-bold">฿450,000</span>
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-2">
                                            หมายเลขติดตามพัสดุ
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-slate-900 dark:text-white text-lg font-mono font-bold">
                                                TH1234567890K
                                            </p>
                                            <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">
                                                    content_copy
                                                </span>
                                                คัดลอก
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- Progress Stepper / Timeline --> */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                            <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-8">
                                สถานะการจัดส่งล่าสุด
                            </h4>
                            <div className="relative space-y-8">
                                {/* <!-- Timeline vertical bar --> */}
                                <div className="timeline-line"></div>
                                <div className="timeline-line timeline-line-active h-[50%]"></div>
                                {/* <!-- Step 1: Completed --> */}
                                <div className="relative flex gap-6">
                                    <div className="z-10 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-[20px]">package_2</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-slate-900 dark:text-white font-bold">เตรียมจัดส่ง</p>
                                            <span className="bg-success/10 text-success text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                                สำเร็จ
                                            </span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                                            ผู้ขายทำการตรวจสอบและแพ็คสินค้าเรียบร้อยแล้ว
                                        </p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            20 ต.ค. 2023 • 09:30 น. | กรุงเทพมหานคร
                                        </p>
                                    </div>
                                </div>
                                {/* <!-- Step 2: Completed --> */}
                                <div className="relative flex gap-6">
                                    <div className="z-10 size-10 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-slate-900 dark:text-white font-bold">
                                                บริษัทขนส่งรับพัสดุแล้ว
                                            </p>
                                            <span className="bg-success/10 text-success text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                                สำเร็จ
                                            </span>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                                            พัสดุถูกรับโดย Kerry Express และอยู่ที่ศูนย์คัดแยกสินค้า
                                        </p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            20 ต.ค. 2023 • 14:45 น. | ศูนย์กระจายสินค้า ลาดกระบัง
                                        </p>
                                    </div>
                                </div>
                                {/* <!-- Step 3: Current --> */}
                                <div className="relative flex gap-6">
                                    <div className="z-10 size-10 rounded-full bg-white dark:bg-slate-900 border-2 border-primary flex items-center justify-center text-primary ring-4 ring-white dark:ring-slate-900 animate-pulse">
                                        <span className="material-symbols-outlined text-[20px]">delivery_dining</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-primary font-bold">กำลังนำจ่าย</p>
                                            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                                กำลังดำเนินการ
                                            </span>
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                                            พัสดุกำลังเดินทางไปยังบ้านของคุณ คาดว่าจะถึงภายในวันนี้
                                        </p>
                                        <p className="text-slate-400 text-xs mt-1">
                                            21 ต.ค. 2023 • 08:20 น. | เขตบางนา, กรุงเทพฯ
                                        </p>
                                    </div>
                                </div>
                                {/* <!-- Step 4: Pending --> */}
                                <div className="relative flex gap-6 opacity-50">
                                    <div className="z-10 size-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 ring-4 ring-white dark:ring-slate-900">
                                        <span className="material-symbols-outlined text-[20px]">home_pin</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-slate-900 dark:text-white font-bold">จัดส่งสำเร็จ</p>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                                            รอการยืนยันการรับสินค้าจากผู้ซื้อ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- Action Buttons --> */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined">chat_bubble</span>
                                ติดต่อผู้ขาย
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-4 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                <span className="material-symbols-outlined">support_agent</span>
                                ติดต่อบริษัทขนส่ง
                            </button>
                        </div>
                        {/* <!-- Help / Footer Info --> */}
                        <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-4">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">คำแนะนำ</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    กรุณาถ่ายวิดีโอขณะเปิดกล่องพัสดุเพื่อใช้เป็นหลักฐานในกรณีที่เกิดปัญหาหรือสินค้าไม่ตรงตามที่ประมูล
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                {/* <!-- Small Footer --> */}
                <footer className="py-10 flex flex-col items-center gap-4 text-slate-400 text-sm">
                    <div className="flex gap-6">
                        <a className="hover:text-primary transition-colors" href="#">
                            ช่วยเหลือ
                        </a>
                        <a className="hover:text-primary transition-colors" href="#">
                            เงื่อนไขการใช้งาน
                        </a>
                        <a className="hover:text-primary transition-colors" href="#">
                            นโยบายความเป็นส่วนตัว
                        </a>
                    </div>
                    <p>© 2023 Afferprice. สงวนลิขสิทธิ์.</p>
                </footer>
            </div>
        </div>
    );
}

export default Page;
