import React from "react";

function Page() {
    return (
        <>
            {/* <!-- Top Navigation Bar --> */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="text-primary size-8">
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
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Afferprice</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a
                                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="#"
                            >
                                หน้าหลัก
                            </a>
                            <a
                                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="#"
                            >
                                การประมูล
                            </a>
                            <a
                                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="#"
                            >
                                วิธีการใช้งาน
                            </a>
                            <a
                                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors"
                                href="#"
                            >
                                ติดต่อเรา
                            </a>
                        </nav>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30">
                                <img
                                    className="h-full w-full object-cover"
                                    data-alt="User profile avatar"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0IgcltU7YtbJLniu7kmLpOSucR3BD4LoEV9Ou2pTXNks8HV2FL8cqOMLn8ANI9dtaYyurstWPK-znUHNlsJLhrFrx_QT299yCmpTDjuDDs0Pgn-k88KymMmB0uTzNGSyArRwl2NZsdSxszJd4KKDLdtsgc6PCOs4Xs-5OvlmO182_iUAW2AX0V6ehfTEcNmjEtSqG-CI180zZB2AAeD_zcaCD_Bcw1lrBX45bN9KQ9RLLz8pEzVGp9K80fmra-kGmm028FqNGcGY"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* <!-- Main Content Area --> */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
                <div className="max-w-[500px] w-full space-y-8 text-center">
                    {/* <!-- Success Status Section --> */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success">
                            <span className="material-symbols-outlined !text-5xl">check_circle</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            ชำระเงินสำเร็จ
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            ขอบคุณสำหรับการประมูล รายการของคุณกำลังดำเนินการ
                        </p>
                    </div>
                    {/* <!-- QR Payment Section --> */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center bg-[#003d6b] p-2 rounded-lg w-full max-w-[180px]">
                                <img
                                    className="h-8 object-contain brightness-0 invert"
                                    data-alt="Thai PromptPay payment system logo"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdKHkqRA0k6KcQQnzaptvuk9uWwgQthZAtYBIFMyNpEB5TJqWWmWCxRq6-3p40XxuQczfR7OHfulocEDVl47Y0Wu81RiHh2vXw7HhZMIcnGqLceFcHkJ8BmVJnHMzmGwynsIr_X9jW9gTfv82hS7B_3nyTvOcwiZ1ZkZdLqFtXOJ6R3xcm-79CVg2pJvGE5azYpB6M_rmjvRsvHQkCY-c4vqh1DJ47EHZCUWf3G9gMR4bXBew4ahHxoZIWQ25DY1RIQ-o6_7vIN44"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                สแกนคิวอาร์โค้ดเพื่อตรวจสอบการชำระเงิน
                            </p>
                            <div className="bg-white p-4 rounded-lg border-2 border-gray-100 shadow-inner">
                                <div className="aspect-square w-48 bg-gray-50 flex items-center justify-center relative">
                                    {/* <!-- QR Code Placeholder --> */}
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[length:20px_20px]"></div>
                                    <img
                                        className="relative z-10 w-full h-full border border-gray-200"
                                        data-alt="Dynamic PromptPay QR Code for transaction"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD46wKO4QVEMUkyFZlg6mhZ7_GTGK-eS1NbC8trBzQjHcwpU5kJsZ93Kz_j-dZe-RVd1tt7-ElWkG4e9iyWXcMNIFh1E9EckARJCqoNP0-9hoTQ0DxwPDMdHSvi9mbiryeTJJxZzNUq2K4iJ8I0yhraWFWSDJgPas8oS3-Vu15nXHZ8r1iyEa37ucuXq_Jp4D9S-gQH-03oLytVkZCs1RcOU3qT-O-4OHZ4zn1pI6xQHSo7PsTENUyAv-uxGC_xlgudKWfYFZanUxw"
                                    />
                                </div>
                            </div>
                            <div className="w-full text-center space-y-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">ยอดชำระทั้งหมด</p>
                                <p className="text-3xl font-bold text-primary">฿450,000.00</p>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold transition-colors">
                                <span className="material-symbols-outlined text-xl">download</span>
                                <span>บันทึกรูปภาพ</span>
                            </button>
                        </div>
                    </div>
                    {/* <!-- Order Summary Card --> */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 text-left">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">receipt_long</span>
                            รายละเอียดการสั่งซื้อ
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">ชื่อสินค้า</span>
                                <span className="text-gray-900 dark:text-white text-sm font-semibold text-right">
                                    นาฬิกา Rolex Submariner (Custom Dial)
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-500 dark:text-gray-400 text-sm">รหัสรายการ</span>
                                <span className="text-gray-900 dark:text-white text-sm font-mono uppercase">
                                    BD-987456123
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center gap-4">
                                <span className="text-gray-900 dark:text-white font-bold">ยอดชำระสุทธิ</span>
                                <span className="text-gray-900 dark:text-white font-bold text-lg">฿450,000</span>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Action Buttons --> */}
                    <div className="flex flex-col gap-4">
                        <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]">
                            ไปที่การประมูลของฉัน
                        </button>
                        <a
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center justify-center gap-1 transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            กลับสู่หน้าหลัก
                        </a>
                    </div>
                    {/* <!-- Footer Trust Tag --> */}
                    <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        <span>การชำระเงินมีความปลอดภัยและได้รับการเข้ารหัสแบบ End-to-End</span>
                    </div>
                </div>
            </main>
            {/* <!-- Footer Space --> */}
            <footer className="py-8 border-t border-gray-200 dark:border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500">© 2024 Afferprice Auction Platform. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default Page;
