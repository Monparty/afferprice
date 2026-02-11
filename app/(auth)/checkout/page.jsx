import React from "react";

function Page() {
    return (
        <>
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="size-8">
                            {/* <svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
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
                            </svg> */}
                        </div>
                        <h2 className="text-navy-dark dark:text-white text-2xl font-bold leading-tight tracking-tight">
                            Afferprice
                        </h2>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <a
                            className="text-navy-dark dark:text-gray-300 text-sm font-semibold hover:text-primary transition-colors"
                            href="#"
                        >
                            ประมูล
                        </a>
                        <a
                            className="text-navy-dark dark:text-gray-300 text-sm font-semibold hover:text-primary transition-colors"
                            href="#"
                        >
                            วิธีใช้งาน
                        </a>
                        <a
                            className="text-navy-dark dark:text-gray-300 text-sm font-semibold hover:text-primary transition-colors"
                            href="#"
                        >
                            ช่วยเหลือ
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 w-64">
                        <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-500"
                            placeholder="ค้นหาสินค้าประมูล..."
                            type="text"
                        />
                    </div>
                    <button className="bg-primary text-white text-sm font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-all shadow-sm">
                        บัญชีของฉัน
                    </button>
                </div>
            </div>
            <main className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-20 py-8">
                {/* <!-- Breadcrumb --> */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <a className="hover:text-primary" href="#">
                        หน้าแรก
                    </a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <a className="hover:text-primary" href="#">
                        การประมูลที่ชนะ
                    </a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-navy-dark dark:text-white font-semibold">ชำระเงิน</span>
                </div>
                {/* <!-- Page Header --> */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-navy-dark dark:text-white mb-2">
                        ชำระเงินและเลือกวิธีจัดส่ง
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        ดำเนินการชำระเงินสำหรับสินค้าที่คุณชนะประมูลเพื่อเริ่มขั้นตอนการจัดส่ง
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* <!-- Left Column: Checkout Details --> */}
                    <div className="flex-1 space-y-8">
                        {/* <!-- 1. Order Summary Section --> */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-dark text-white text-sm font-bold">
                                    1
                                </span>
                                <h2 className="text-xl font-bold dark:text-white">สรุปรายการสินค้าที่ชนะ</h2>
                            </div>
                            <div className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                <div
                                    className="w-full md:w-48 h-32 bg-center bg-cover rounded-lg"
                                    data-alt="Luxury Rolex Submariner watch close up"
                                    style={{
                                        backgroundImage:
                                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAr_Skt7Ha2CIOeps76mm5gfQPF90cGBQ8QIDOFavOPPhKT0s3n2ePN1aIk7bOPp1yKCh_MLaJNXNtd6IUn8Vp8MhDo4W0O6jeJIs677y6DFIp3S1L1tKxJ__Riu76P2B3WItL320AnCHmui_IA34SOQ2ayGLbTJ8qPFcK0-q-7NQW_M4tBTNTYY9iRdxW6bBFApSJqq1ISreXLHSrYpxpHvYd48mmzlSYUfXawdKlsMoAZSfS7t3OdFSECAkroJ3SJ5PjfKUdG03M')",
                                    }}
                                ></div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-navy-dark dark:text-white mb-1">
                                            Rolex Submariner Date 41mm (New 2024)
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            รหัสการประมูล: #BD-99210
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                                            ชนะประมูล
                                        </span>
                                        <div className="mt-1">
                                            <span className="text-2xl font-bold text-navy-dark dark:text-white">
                                                ฿450,000
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- 2. Shipping Address --> */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-dark text-white text-sm font-bold">
                                        2
                                    </span>
                                    <h2 className="text-xl font-bold dark:text-white">ที่อยู่จัดส่ง</h2>
                                </div>
                                <button className="flex items-center gap-1 text-primary font-bold text-sm hover:underline">
                                    <span className="material-symbols-outlined text-base">add</span> เพิ่มที่อยู่ใหม่
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* <!-- Address Card (Selected) --> */}
                                <div className="relative p-4 border-2 border-primary rounded-xl bg-primary/5 cursor-pointer">
                                    <div className="absolute top-4 right-4">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                    </div>
                                    <h4 className="font-bold mb-1 dark:text-white">สมชาย สายประมูล (ที่บ้าน)</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        123/45 ถนนสุขุมวิท แขวงคลองเตยเหนือ
                                        <br />
                                        เขตวัฒนา กรุงเทพมหานคร 10110
                                        <br />
                                        โทร: 081-234-5678
                                    </p>
                                </div>
                                {/* <!-- Address Card --> */}
                                <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                                    <h4 className="font-bold mb-1 dark:text-white group-hover:text-primary">
                                        สมชาย (ที่ทำงาน)
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                        อาคารสมาร์ททาวเวอร์ ชั้น 15 ถนนรัชดาภิเษก
                                        <br />
                                        เขตดินแดง กรุงเทพมหานคร 10400
                                        <br />
                                        โทร: 081-234-5678
                                    </p>
                                </div>
                            </div>
                        </section>
                        {/* <!-- 3. Shipping Method --> */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-dark text-white text-sm font-bold">
                                    3
                                </span>
                                <h2 className="text-xl font-bold dark:text-white">รูปแบบการจัดส่ง</h2>
                            </div>
                            <div className="space-y-3">
                                {/* <!-- Method Option --> */}
                                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                    <div className="flex items-center gap-4">
                                        <input
                                            checked=""
                                            className="text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                            name="shipping"
                                            type="radio"
                                            value="express"
                                        />
                                        <div>
                                            <p className="font-bold dark:text-white">Express Delivery (ด่วนพิเศษ)</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                ได้รับสินค้าภายใน 1-2 วันทำการ
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-navy-dark dark:text-white">฿80</span>
                                </label>
                                {/* <!-- Method Option --> */}
                                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                    <div className="flex items-center gap-4">
                                        <input
                                            className="text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                            name="shipping"
                                            type="radio"
                                            value="standard"
                                        />
                                        <div>
                                            <p className="font-bold dark:text-white">Standard Delivery (ธรรมดา)</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                ได้รับสินค้าภายใน 3-5 วันทำการ
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-navy-dark dark:text-white">฿40</span>
                                </label>
                                {/* <!-- Method Option --> */}
                                <label className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                    <div className="flex items-center gap-4">
                                        <input
                                            className="text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                            name="shipping"
                                            type="radio"
                                            value="pickup"
                                        />
                                        <div>
                                            <p className="font-bold dark:text-white">
                                                Self-pickup (รับสินค้าด้วยตัวเอง)
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                รับสินค้าที่คลังสินค้าหลัก (ลาดพร้าว)
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-green-600">ฟรี</span>
                                </label>
                            </div>
                        </section>
                        {/* <!-- 4. Payment Method --> */}
                        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy-dark text-white text-sm font-bold">
                                    4
                                </span>
                                <h2 className="text-xl font-bold dark:text-white">ช่องทางชำระเงิน</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* <!-- Payment Tile --> */}
                                <label className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center transition-all">
                                    <input
                                        checked=""
                                        className="sr-only"
                                        name="payment"
                                        type="radio"
                                        value="promptpay"
                                    />
                                    <div className="size-12 mb-3 flex items-center justify-center text-navy-dark dark:text-white">
                                        <span className="material-symbols-outlined text-4xl">qr_code_2</span>
                                    </div>
                                    <p className="font-bold text-sm dark:text-white">Thai QR PromptPay</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase">Instant Payment</p>
                                </label>
                                {/* <!-- Payment Tile --> */}
                                <label className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center transition-all">
                                    <input className="sr-only" name="payment" type="radio" value="card" />
                                    <div className="size-12 mb-3 flex items-center justify-center text-navy-dark dark:text-white">
                                        <span className="material-symbols-outlined text-4xl">credit_card</span>
                                    </div>
                                    <p className="font-bold text-sm dark:text-white">Credit / Debit Card</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase">Visa, Mastercard, JCB</p>
                                </label>
                                {/* <!-- Payment Tile --> */}
                                <label className="flex flex-col items-center justify-center p-6 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center transition-all">
                                    <input className="sr-only" name="payment" type="radio" value="transfer" />
                                    <div className="size-12 mb-3 flex items-center justify-center text-navy-dark dark:text-white">
                                        <span className="material-symbols-outlined text-4xl">account_balance</span>
                                    </div>
                                    <p className="font-bold text-sm dark:text-white">Mobile Banking</p>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase">Bank Transfer</p>
                                </label>
                            </div>
                            {/* <!-- Payment Details (Conditional) --> */}
                            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/80 rounded-lg flex items-center gap-4">
                                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                                    <img
                                        className="w-20 h-20 rounded"
                                        data-alt="Sample QR code for PromptPay payment"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgPpTeI_xuWHJ_ciIa3mp2Y44N0GGuZzWkoxR8hKkFZFmtcfM8wn-kzKl713KB1Zw8iTlABW5vejr4Fr-PeGnA9lg86rJlpc6tJJ8OsHE-Ru8Lf5E4AFg9wEAdIT3aBKNhtCtP4eA9Ak8PVFVnhEi0q_akWX0K_dc0E_J3PT3idw9HXR-9GJczxASKcCwi38Ox2EUzRqvXevMf2hnDtaaNA36M4ZIpWjCJEJP-73fGSWB35ulJql3clf__Dk8eex6VrjgVCB40wDY"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-bold dark:text-white">สแกนเพื่อชำระเงิน</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                        สามารถใช้แอปพลิเคชันธนาคารทุกธนาคารในการสแกนจ่าย
                                        ระบบจะยืนยันการชำระเงินให้อัตโนมัติทันที
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* <!-- Right Column: Sidebar Summary --> */}
                    <div className="w-full lg:w-[380px]">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl border border-primary/20">
                                <h2 className="text-xl font-bold mb-6 dark:text-white">สรุปยอดชำระเงิน</h2>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>ราคาชนะประมูล</span>
                                        <span className="font-semibold text-navy-dark dark:text-white">฿450,000</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>ค่าธรรมเนียมการประมูล (5%)</span>
                                        <span className="font-semibold text-navy-dark dark:text-white">฿22,500</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>ค่าจัดส่ง (Express)</span>
                                        <span className="font-semibold text-navy-dark dark:text-white">฿80</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">
                                                ยอดรวมสุทธิ
                                            </p>
                                            <p className="text-xs text-gray-400 italic">(รวมภาษีมูลค่าเพิ่มแล้ว)</p>
                                        </div>
                                        <span className="text-3xl font-bold text-primary">฿472,580</span>
                                    </div>
                                </div>
                                <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 text-lg active:scale-[0.98]">
                                    <span className="material-symbols-outlined">verified_user</span>
                                    ยืนยันการชำระเงิน
                                </button>
                                <p className="text-[10px] text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">lock</span>
                                    ข้อมูลของคุณจะถูกเก็บเป็นความลับและปลอดภัยภายใต้มาตรฐานสากล
                                </p>
                            </div>
                            {/* <!-- Trust Indicators --> */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                                    <span className="material-symbols-outlined text-green-600 mb-1">security</span>
                                    <p className="text-[10px] font-bold dark:text-gray-300">ความปลอดภัยสูงสุด</p>
                                </div>
                                <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                                    <span className="material-symbols-outlined text-blue-600 mb-1">verified</span>
                                    <p className="text-[10px] font-bold dark:text-gray-300">ผู้ขายผ่านการรับรอง</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="bg-white dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 py-10 mt-20">
                <div className="max-w-[1280px] mx-auto px-10 text-center">
                    <div className="flex items-center justify-center gap-2 text-primary mb-4">
                        <div className="size-6">
                            {/* <svg fill="currentColor" viewbox="0 0 48 48">
                                <path
                                    clip-rule="evenodd"
                                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                                ></path>
                            </svg> */}
                        </div>
                        <h2 className="text-navy-dark dark:text-white text-lg font-bold">Afferprice</h2>
                    </div>
                    <p className="text-gray-500 text-sm">© 2024 Afferprice Auction Platform. All rights reserved.</p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a className="text-xs text-gray-400 hover:text-primary" href="#">
                            ข้อกำหนดและเงื่อนไข
                        </a>
                        <a className="text-xs text-gray-400 hover:text-primary" href="#">
                            นโยบายความเป็นส่วนตัว
                        </a>
                        <a className="text-xs text-gray-400 hover:text-primary" href="#">
                            ติดต่อเรา
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Page;
