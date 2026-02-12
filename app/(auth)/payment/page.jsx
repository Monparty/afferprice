import UseButton from "@/app/components/inputs/UseButton";
import { ArrowLeftOutlined, CheckCircleFilled, DownloadOutlined, FileDoneOutlined } from "@ant-design/icons";
import Link from "next/link";

function Page() {
    return (
        <main>
            <div className="grid place-items-center">
                <div className="w-fit space-y-6 text-center">
                    <div className="grid place-items-center space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                            <CheckCircleFilled className="text-2xl! text-green-600!" />
                        </div>
                        <p className="text-gray-500 dark::text-gray-400">
                            ขอบคุณสำหรับการประมูล รายการของคุณกำลังดำเนินการ
                        </p>
                    </div>
                    <div className="bg-white dark::bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark::border-gray-800">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center bg-[#003d6b] p-2 rounded-lg w-full max-w-45">
                                <img
                                    className="h-8 object-contain brightness-0 invert"
                                    data-alt="Thai PromptPay payment system logo"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdKHkqRA0k6KcQQnzaptvuk9uWwgQthZAtYBIFMyNpEB5TJqWWmWCxRq6-3p40XxuQczfR7OHfulocEDVl47Y0Wu81RiHh2vXw7HhZMIcnGqLceFcHkJ8BmVJnHMzmGwynsIr_X9jW9gTfv82hS7B_3nyTvOcwiZ1ZkZdLqFtXOJ6R3xcm-79CVg2pJvGE5azYpB6M_rmjvRsvHQkCY-c4vqh1DJ47EHZCUWf3G9gMR4bXBew4ahHxoZIWQ25DY1RIQ-o6_7vIN44"
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-600 dark::text-gray-300">
                                สแกนคิวอาร์โค้ดเพื่อตรวจสอบการชำระเงิน
                            </p>
                            <div className="bg-white p-4 rounded-lg border-2 border-gray-100 shadow-inner">
                                <div className="aspect-square w-48 bg-gray-50 flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-[length:20px_20px]"></div>
                                    <img
                                        className="relative z-10 w-full h-full border border-gray-200"
                                        data-alt="Dynamic PromptPay QR Code for transaction"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD46wKO4QVEMUkyFZlg6mhZ7_GTGK-eS1NbC8trBzQjHcwpU5kJsZ93Kz_j-dZe-RVd1tt7-ElWkG4e9iyWXcMNIFh1E9EckARJCqoNP0-9hoTQ0DxwPDMdHSvi9mbiryeTJJxZzNUq2K4iJ8I0yhraWFWSDJgPas8oS3-Vu15nXHZ8r1iyEa37ucuXq_Jp4D9S-gQH-03oLytVkZCs1RcOU3qT-O-4OHZ4zn1pI6xQHSo7PsTENUyAv-uxGC_xlgudKWfYFZanUxw"
                                    />
                                </div>
                            </div>
                            <div className="w-full text-center space-y-1">
                                <p className="text-sm text-gray-500 dark::text-gray-400">ยอดชำระทั้งหมด</p>
                                <p className="text-3xl font-bold text-primary">฿450,000.00</p>
                            </div>
                            <UseButton
                                label="บันทึกรูปภาพ"
                                icon={DownloadOutlined}
                                type="default"
                                className="h-12! text-base! font-bold!"
                                wFull
                            />
                        </div>
                    </div>
                    <div className="bg-white dark::bg-zinc-900 rounded-xl shadow-sm p-6 border border-gray-100 dark::border-gray-800 text-left">
                        <h2 className="text-lg font-bold text-gray-900 dark::text-white mb-4 flex items-center gap-2">
                            <FileDoneOutlined className="text-xl! text-orange-600!" />
                            รายละเอียดการสั่งซื้อ
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <span className="text-gray-500 dark::text-gray-400 text-sm">ชื่อสินค้า</span>
                                <span className="text-gray-900 dark::text-white text-sm font-semibold text-right">
                                    นาฬิกา Rolex Submariner (Custom Dial)
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-500 dark::text-gray-400 text-sm">รหัสรายการ</span>
                                <span className="text-gray-900 dark::text-white text-sm font-mono uppercase">
                                    BD-987456123
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-100 dark::border-gray-800 flex justify-between items-center gap-4">
                                <span className="text-gray-900 dark::text-white font-bold">ยอดชำระสุทธิ</span>
                                <span className="text-gray-900 dark::text-white font-bold text-lg">฿450,000</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <UseButton label="ไปที่การประมูลของฉัน" className="h-12! text-base! font-bold!" wFull />
                        <Link href="/">
                            <div className="text-sm flex gap-2 justify-center items-center">
                                <ArrowLeftOutlined /> กลับสู่หน้าหลัก
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Page;
