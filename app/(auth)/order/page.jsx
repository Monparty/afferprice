import UseButton from "@/app/components/inputs/UseButton";
import UseSteps from "@/app/components/utils/UseSteps";
import UseTag from "@/app/components/utils/UseTag";
import {
    CarOutlined,
    CopyOutlined,
    EnvironmentOutlined,
    InboxOutlined,
    InfoCircleFilled,
    PhoneOutlined,
    TruckOutlined,
    WechatOutlined,
} from "@ant-design/icons";

function Page() {
    const items = [
        {
            title: (
                <div className="flex gap-2 items-center">
                    <p className="font-bold">เตรียมจัดส่ง</p>
                </div>
            ),
            content: (
                <div>
                    <p className="text-sm mb-2">ผู้ขายทำการตรวจสอบและแพ็คสินค้าเรียบร้อยแล้ว</p>
                    <p className="text-xs">20 ต.ค. 2023 • 09:30 น. | กรุงเทพมหานคร</p>
                </div>
            ),
            subTitle: <UseTag label="สำเร็จ" color="green" />,
            icon: <InboxOutlined className="text-base" />,
        },
        {
            title: (
                <div className="flex gap-2 items-center">
                    <p className="font-bold">บริษัทขนส่งรับพัสดุแล้ว</p>
                </div>
            ),
            content: (
                <div>
                    <p className="text-sm mb-2">พัสดุถูกรับโดย Kerry Express และอยู่ที่ศูนย์คัดแยกสินค้า</p>
                    <p className="text-xs">20 ต.ค. 2023 • 14:45 น. | ศูนย์กระจายสินค้า ลาดกระบัง</p>
                </div>
            ),
            subTitle: <UseTag label="สำเร็จ" color="green" />,
            icon: <TruckOutlined className="text-base" />,
        },
        {
            title: (
                <div className="flex gap-2 items-center">
                    <p className="font-bold">กำลังนำจ่าย</p>
                </div>
            ),
            content: (
                <div>
                    <p className="text-sm mb-2">พัสดุกำลังเดินทางไปยังบ้านของคุณ คาดว่าจะถึงภายในวันนี้</p>
                    <p className="text-xs">21 ต.ค. 2023 • 08:20 น. | เขตบางนา, กรุงเทพฯ</p>
                </div>
            ),
            subTitle: <UseTag label="กำลังดำเนินการ" color="orange" />,
            icon: <CarOutlined className="text-base" />,
        },
        {
            title: (
                <div className="flex gap-2 items-center">
                    <p className="font-bold">จัดส่งสำเร็จ</p>
                </div>
            ),
            content: (
                <div>
                    <p className="text-sm mb-2">รอการยืนยันการรับสินค้าจากผู้ซื้อ</p>
                </div>
            ),
            subTitle: null,
            icon: <EnvironmentOutlined className="text-base" />,
        },
    ];
    return (
        <main>
            <div className="layout-content-container flex flex-col w-full gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-slate-900 dark::text-white text-3xl font-extrabold tracking-tight">
                        ติดตามสถานะการจัดส่ง
                    </h1>
                    <p className="text-slate-500 dark::text-slate-400">หมายเลขคำสั่งซื้อ: #BD-987654321</p>
                </div>
                <div className="bg-white dark::bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark::border-slate-800 p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-48 aspect-square rounded-lg bg-slate-100 dark::bg-slate-800 overflow-hidden shrink-0">
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
                                        <h3 className="text-slate-900 dark::text-white text-xl font-bold mb-2">
                                            Rolex Submariner Date 126610LN
                                        </h3>
                                    </div>
                                    <UseTag color="orange" label="กำลังดำเนินการ" />
                                </div>
                                <p className="text-slate-600 dark::text-slate-400 text-sm mb-4">
                                    ราคาชนะประมูล:{" "}
                                    <span className="text-slate-900 dark::text-white font-bold">฿450,000</span>
                                </p>
                            </div>
                            <div className="bg-slate-50 dark::bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark::border-slate-800">
                                <p className="text-slate-500 dark::text-slate-400 text-xs font-medium mb-2">
                                    หมายเลขติดตามพัสดุ
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-900 dark::text-white text-lg font-mono font-bold">
                                        TH1234567890K
                                    </p>
                                    <UseButton label="คัดลอก" type="default" icon={CopyOutlined} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark::bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark::border-slate-800 p-8">
                    <h4 className="text-slate-900 dark::text-white font-bold text-lg mb-8">สถานะการจัดส่งล่าสุด</h4>
                    <UseSteps items={items} current={2} orientation="vertical" height="h-[7rem]" />
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                        <UseButton label="ติดต่อผู้ขาย" size="large" icon={WechatOutlined} />
                        <UseButton label="ติดต่อบริษัทขนส่ง" size="large" type="default" icon={PhoneOutlined} />
                    </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-orange-50 border border-orange-600 flex items-start gap-4">
                    <InfoCircleFilled className="text-xl text-orange-600!" />
                    <div>
                        <p className="text-sm font-bold text-slate-900 dark::text-white">คำแนะนำ</p>
                        <p className="text-sm text-slate-600 dark::text-slate-400">
                            กรุณาถ่ายวิดีโอขณะเปิดกล่องพัสดุเพื่อใช้เป็นหลักฐานในกรณีที่เกิดปัญหาหรือสินค้าไม่ตรงตามที่ประมูล
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Page;
