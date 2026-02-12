import UseButton from "@/app/components/inputs/UseButton";
import {
    BankFilled, CheckCircleFilled,
    CreditCardFilled,
    LockFilled,
    PlusOutlined,
    QrcodeOutlined,
    SafetyOutlined
} from "@ant-design/icons";
import UseTag from "@/app/components/utils/UseTag";

function Page() {
    return (
        <main>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    <section className="bg-white dark::bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark::border-gray-800">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="flex items-center bg-orange-600 justify-center w-8 h-8 rounded-full text-white text-sm font-bold">
                                1
                            </span>
                            <h2 className="text-xl font-bold dark::text-white">สรุปรายการสินค้าที่ชนะ</h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 p-4 border border-gray-100 dark::border-gray-800 rounded-xl bg-gray-50 dark::bg-gray-800/50">
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
                                    <h3 className="text-lg font-bold text-navy-dark dark::text-white mb-1">
                                        Rolex Submariner Date 41mm (New 2024)
                                    </h3>
                                    <p className="text-sm text-gray-500 dark::text-gray-400">รหัสการประมูล: #BD-99210</p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <UseTag label="ราคาชนะประมูล" color="orange" />
                                    <div className="mt-1">
                                        <span className="text-2xl font-bold text-navy-dark dark::text-white">
                                            ฿450,000
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* <!-- 2. Shipping Address --> */}
                    <section className="bg-white dark::bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark::border-gray-800">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center bg-orange-600 justify-center w-8 h-8 rounded-full text-white text-sm font-bold">
                                    2
                                </span>
                                <h2 className="text-xl font-bold dark::text-white">ที่อยู่จัดส่ง</h2>
                            </div>
                            <UseButton label="เพิ่มที่อยู่ใหม่" type="default" icon={PlusOutlined} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* <!-- Address Card (Selected) --> */}
                            <div className="relative p-4 border-2 border-primary rounded-xl bg-primary/5 cursor-pointer">
                                <div className="absolute top-4 right-4">
                                    <span className="material-symbols-outlined text-primary">check_circle</span>
                                </div>
                                <h4 className="font-bold mb-1 dark::text-white">สมชาย สายประมูล (ที่บ้าน)</h4>
                                <p className="text-sm text-gray-600 dark::text-gray-400 leading-relaxed">
                                    123/45 ถนนสุขุมวิท แขวงคลองเตยเหนือ
                                    <br />
                                    เขตวัฒนา กรุงเทพมหานคร 10110
                                    <br />
                                    โทร: 081-234-5678
                                </p>
                            </div>
                            {/* <!-- Address Card --> */}
                            <div className="p-4 border border-gray-200 dark::border-gray-800 rounded-xl hover:border-primary transition-colors cursor-pointer group">
                                <h4 className="font-bold mb-1 dark::text-white group-hover:text-primary">
                                    สมชาย (ที่ทำงาน)
                                </h4>
                                <p className="text-sm text-gray-500 dark::text-gray-400 leading-relaxed">
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
                    <section className="bg-white dark::bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark::border-gray-800">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="flex items-center justify-center bg-orange-600 w-8 h-8 rounded-full text-white text-sm font-bold">
                                3
                            </span>
                            <h2 className="text-xl font-bold dark::text-white">รูปแบบการจัดส่ง</h2>
                        </div>
                        <div className="space-y-3">
                            {/* <!-- Method Option --> */}
                            <label className="flex items-center justify-between p-4 border border-gray-200 dark::border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark::hover:bg-gray-800 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                <div className="flex items-center gap-4">
                                    <input
                                        checked=""
                                        className="text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                        name="shipping"
                                        type="radio"
                                        value="express"
                                    />
                                    <div>
                                        <p className="font-bold dark::text-white">Express Delivery (ด่วนพิเศษ)</p>
                                        <p className="text-xs text-gray-500 dark::text-gray-400">
                                            ได้รับสินค้าภายใน 1-2 วันทำการ
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-navy-dark dark::text-white">฿80</span>
                            </label>
                            {/* <!-- Method Option --> */}
                            <label className="flex items-center justify-between p-4 border border-gray-200 dark::border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark::hover:bg-gray-800 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                <div className="flex items-center gap-4">
                                    <input
                                        className="text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                        name="shipping"
                                        type="radio"
                                        value="standard"
                                    />
                                    <div>
                                        <p className="font-bold dark::text-white">Standard Delivery (ธรรมดา)</p>
                                        <p className="text-xs text-gray-500 dark::text-gray-400">
                                            ได้รับสินค้าภายใน 3-5 วันทำการ
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-navy-dark dark::text-white">฿40</span>
                            </label>
                            {/* <!-- Method Option --> */}
                            <label className="flex items-center justify-between p-4 border border-gray-200 dark::border-gray-800 rounded-xl cursor-pointer hover:bg-gray-50 dark::hover:bg-gray-800 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                <div className="flex items-center gap-4">
                                    <input
                                        className="text-primary focus:ring-primary h-5 w-5 border-gray-300"
                                        name="shipping"
                                        type="radio"
                                        value="pickup"
                                    />
                                    <div>
                                        <p className="font-bold dark::text-white">Self-pickup (รับสินค้าด้วยตัวเอง)</p>
                                        <p className="text-xs text-gray-500 dark::text-gray-400">
                                            รับสินค้าที่คลังสินค้าหลัก (ลาดพร้าว)
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-green-600">ฟรี</span>
                            </label>
                        </div>
                    </section>
                    {/* <!-- 4. Payment Method --> */}
                    <section className="bg-white dark::bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark::border-gray-800">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="flex items-center justify-center bg-orange-600 w-8 h-8 rounded-full text-white text-sm font-bold">
                                4
                            </span>
                            <h2 className="text-xl font-bold dark::text-white">ช่องทางชำระเงิน</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* <!-- Payment Tile --> */}
                            <label className="flex flex-col items-center justify-center p-6 border border-gray-200 dark::border-gray-800 rounded-xl cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center transition-all">
                                <input checked="" className="sr-only" name="payment" type="radio" value="promptpay" />
                                <QrcodeOutlined className="text-xl! text-black! mb-4" />
                                <p className="font-bold text-sm dark::text-white">Thai QR PromptPay</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase">Instant Payment</p>
                            </label>
                            {/* <!-- Payment Tile --> */}
                            <label className="flex flex-col items-center justify-center p-6 border border-gray-200 dark::border-gray-800 rounded-xl cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center transition-all">
                                <input className="sr-only" name="payment" type="radio" value="card" />
                                <CreditCardFilled className="text-xl! text-black! mb-4" />
                                <p className="font-bold text-sm dark::text-white">Credit / Debit Card</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase">Visa, Mastercard, JCB</p>
                            </label>
                            {/* <!-- Payment Tile --> */}
                            <label className="flex flex-col items-center justify-center p-6 border border-gray-200 dark::border-gray-800 rounded-xl cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 text-center transition-all">
                                <input className="sr-only" name="payment" type="radio" value="transfer" />
                                <BankFilled className="text-xl! text-black! mb-4" />
                                <p className="text-[10px] text-gray-400 mt-1 uppercase">Mobile Banking</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase">Bank Transfer</p>
                            </label>
                        </div>
                        {/* <!-- Payment Details (Conditional) --> */}
                        <div className="mt-6 p-4 bg-gray-50 dark::bg-gray-800/80 rounded-lg flex items-center gap-4">
                            <div className="p-2 bg-white dark::bg-gray-700 rounded-lg shadow-sm">
                                <img
                                    className="w-20 h-20 rounded"
                                    data-alt="Sample QR code for PromptPay payment"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgPpTeI_xuWHJ_ciIa3mp2Y44N0GGuZzWkoxR8hKkFZFmtcfM8wn-kzKl713KB1Zw8iTlABW5vejr4Fr-PeGnA9lg86rJlpc6tJJ8OsHE-Ru8Lf5E4AFg9wEAdIT3aBKNhtCtP4eA9Ak8PVFVnhEi0q_akWX0K_dc0E_J3PT3idw9HXR-9GJczxASKcCwi38Ox2EUzRqvXevMf2hnDtaaNA36M4ZIpWjCJEJP-73fGSWB35ulJql3clf__Dk8eex6VrjgVCB40wDY"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-bold dark::text-white">สแกนเพื่อชำระเงิน</p>
                                <p className="text-xs text-gray-500 dark::text-gray-400 mt-1 leading-relaxed">
                                    สามารถใช้แอปพลิเคชันธนาคารทุกธนาคารในการสแกนจ่าย
                                    ระบบจะยืนยันการชำระเงินให้อัตโนมัติทันที
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
                {/* <!-- Right Column: Sidebar Summary --> */}
                <div className="w-full lg:w-95">
                    <div className="sticky top-12 space-y-6">
                        <div className="bg-white dark::bg-gray-900 rounded-xl p-6 shadow-lg border border-orange-600">
                            <h2 className="text-xl font-bold mb-6 dark::text-white">สรุปยอดชำระเงิน</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 dark::text-gray-400">
                                    <span>ราคาชนะประมูล</span>
                                    <span className="font-semibold text-navy-dark dark::text-white">฿450,000</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark::text-gray-400">
                                    <span>ค่าธรรมเนียมการประมูล (5%)</span>
                                    <span className="font-semibold text-navy-dark dark::text-white">฿22,500</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark::text-gray-400">
                                    <span>ค่าจัดส่ง (Express)</span>
                                    <span className="font-semibold text-navy-dark dark::text-white">฿80</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark::border-gray-800 flex justify-between items-end">
                                    <div>
                                        <p className="text-sm text-gray-500 dark::text-gray-400 uppercase font-bold tracking-wider">
                                            ยอดรวมสุทธิ
                                        </p>
                                        <p className="text-xs text-gray-400 italic">(รวมภาษีมูลค่าเพิ่มแล้ว)</p>
                                    </div>
                                    <span className="text-3xl text-orange-600 font-bold text-primary">฿472,580</span>
                                </div>
                            </div>
                            <UseButton label="ยืนยันการชำระเงิน" className="h-12! text-lg! font-bold!" wFull />
                            <div className="mt-4 text-xs text-gray-400 text-center">
                                <LockFilled />
                                <p className="flex items-center justify-center gap-1">
                                    ข้อมูลของคุณจะถูกเก็บเป็นความลับ
                                    <br />
                                    และปลอดภัยภายใต้มาตรฐานสากล
                                </p>
                            </div>
                        </div>
                        {/* <!-- Trust Indicators --> */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 dark::bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark::border-gray-800 flex gap-1 flex-col items-center text-center">
                                <SafetyOutlined className="text-lg text-blue-500!" />
                                <p className="text-xs font-semibold dark::text-gray-300">ความปลอดภัยสูงสุด</p>
                            </div>
                            <div className="bg-gray-50 dark::bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark::border-gray-800 flex gap-1 flex-col items-center text-center">
                                <CheckCircleFilled className="text-lg text-blue-500!" />
                                <p className="text-xs font-semibold dark::text-gray-300">ผู้ขายผ่านการรับรอง</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Page;
