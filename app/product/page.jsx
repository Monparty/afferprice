import UseButton from "../components/inputs/UseButton";
import UseBreadcrumb from "../components/utils/UseBreadcrumb";
import {
    BankFilled,
    BarChartOutlined,
    ClockCircleFilled,
    LockFilled,
    NotificationFilled,
    RiseOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import UseImageGroup from "../components/utils/UseImageGroup";
import InputText from "../components/inputs/InputText";
import InputNumber from "../components/inputs/InputNumber";

function Page() {
    const UseBreadcrumbItems = [
        {
            href: "",
            title: "product",
        },
        {
            title: "Luxury Profes...",
        },
    ];

    const imageGroup = [
        {
            id: 1,
            width: 100,
            height: 100,
            alt: "Product 1",
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCGH6QSO_u_UuEUCALibK4R2Djny2m206k0cHYhamSJmi1JlNJw9qM5-gbOmPUPKy3nMYILCqmYtyygBB_z_GevWbArnRQUEfYXsNPdow3epYJzRDcqezZv4RKUczfs6_cilcx0m5KMe5aElwiQpFPTtu65g5VSGYLhdPsz7nE_mGuFumqMMuYeIu3pzFX3VHh0FnoH9XrhvvOHSe0yp_7IQexb8ACJov3_bOB0uvoOb-nV_xa3lKoEGs02pXEV0ff82qnGcul0FA",
        },
        {
            id: 1,
            width: 100,
            height: 100,
            alt: "Product 1",
            src: "https://picsum.photos/400/400",
        },
        {
            id: 2,
            width: 100,
            height: 100,
            alt: "Product 2",
            src: "https://picsum.photos/400/401",
        },
        {
            id: 3,
            width: 100,
            height: 100,
            alt: "Product 3",
            src: "https://picsum.photos/400/402",
        },
        {
            id: 4,
            width: 100,
            height: 100,
            alt: "Product 4",
            src: "https://picsum.photos/400/403",
        },
    ];

    return (
        <main>
            <UseBreadcrumb items={UseBreadcrumbItems} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                        <div className="absolute top-4 left-4 z-10">
                            <span className="bg-accent-orange text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span> กำลังประมูล
                            </span>
                        </div>
                        <UseImageGroup imageGroup={imageGroup} alone />
                    </div>
                    <UseImageGroup imageGroup={imageGroup} />
                    <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm space-y-6">
                        <div>
                            <h1 className="text-3xl font-extrabold mb-4 text-primary">
                                Luxury Professional Diver Watch - 2023 New Model
                            </h1>
                            <p className="text-slate-600 leading-relaxed">
                                นาฬิกาดำน้ำระดับพรีเมียมรุ่นล่าสุดปี 2023 ตัวเรือนขนาด 41 มม. ผลิตจาก Oystersteel
                                ที่ทนทาน ขอบหน้าปัดเซรามิก Cerachrom สีดำที่เป็นเอกลักษณ์ ขับเคลื่อนด้วยกลไก Calibre
                                3235 ประสิทธิภาพสูง สินค้าอยู่ในสภาพใหม่ 100% พร้อมสติกเกอร์เดิมและกล่องอุปกรณ์ครบชุด
                                รับประกันศูนย์ถึงปี 2028
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">ปีที่ผลิต</p>
                                <p className="font-semibold text-lg">2023</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">สภาพสินค้า</p>
                                <p className="font-semibold text-lg text-emerald-600">ของใหม่ (Mint)</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">วัสดุ</p>
                                <p className="font-semibold text-lg">Oystersteel</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">การจัดส่ง</p>
                                <p className="font-semibold text-lg">รับประกันทั่วโลก</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">ข้อมูลผู้ขาย</h3>
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="text-white bg-blue-500 h-9 w-9 flex items-center justify-center rounded-full">
                                    <SafetyOutlined className="text-2xl" />
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
                        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                            <div className="p-6 bg-slate-900 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-400 text-sm font-medium">เวลาที่เหลือ:</span>
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <ClockCircleFilled />
                                        <span className="text-sm font-bold uppercase tracking-wider">ปิดเร็วๆ นี้</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-center gap-2">
                                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                                        <span className="block text-2xl font-black text-orange-500">04</span>
                                        <span className="text-[10px] text-slate-400 uppercase">ชั่วโมง</span>
                                    </div>
                                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                                        <span className="block text-2xl font-black text-orange-500">21</span>
                                        <span className="text-[10px] text-slate-400 uppercase">นาที</span>
                                    </div>
                                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                                        <span className="block text-2xl font-black text-orange-500">38</span>
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
                                            <RiseOutlined />
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
                                    <InputNumber size="large" className="h-14" />
                                    <InputText size="large" className="h-14" />
                                    <UseButton
                                        label="วางประมูลทันที"
                                        wFull
                                        size="large"
                                        icon={NotificationFilled}
                                        iconPlacement
                                        className="h-12!"
                                    />
                                    <div className="flex flex-col gap-2 text-sm text-slate-400 text-center">
                                        <span className="flex items-center justify-center gap-2">
                                            <BankFilled className=" text-blue-500!" />
                                            รับประกันสินค้าแท้ 100%
                                        </span>
                                        <span className="flex items-center justify-center gap-2">
                                            <LockFilled className=" text-blue-500!" />
                                            ชำระเงินปลอดภัยและมีระบบคุ้มครอง
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
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
                                <BarChartOutlined className="text-2xl text-blue-800!" />
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
    );
}

export default Page;
