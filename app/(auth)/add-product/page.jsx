"use client";
import InputNumber from "@/app/components/inputs/InputNumber";
import UseButton from "@/app/components/inputs/UseButton";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseUploadDragger from "@/app/components/inputs/UseUploadDragger";
import UseSteps from "@/app/components/utils/UseSteps";
import {
    ArrowRightOutlined,
    CameraFilled,
    CheckCircleFilled,
    DollarOutlined,
    EyeFilled,
    SafetyOutlined,
} from "@ant-design/icons";
import { useForm } from "react-hook-form";

function Page() {
    const { handleSubmit, watch, control } = useForm({});
    const items = [
        {
            title: "รูปภาพ",
            // content: "ระบุรูปภาพและวีดีโอของสินค้า",
            // subTitle: "Left 00:00:08",
        },
        {
            title: "รายละเอียดสินค้า",
        },
        {
            title: "การตั้งค่าประมูล",
        },
    ];

    // console.log("watch", watch());

    return (
        <main className="w-full flex flex-col gap-8">
            <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-accent">ขั้นตอนที่ 1 จาก 3</span>
                        <span className="text-sm text-slate-400">•</span>
                        <span className="text-sm font-medium text-slate-600">อัปโหลดรูปภาพ</span>
                    </div>
                    <span className="text-sm font-medium text-slate-400">สำเร็จแล้ว 33%</span>
                </div>
                <UseSteps items={items} current={0} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <CameraFilled className="text-orange-600!" />
                                อัปโหลดรูปภาพ
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                รูปภาพคุณภาพสูงจะช่วยเพิ่มโอกาสในการขายได้ถึง 40%
                            </p>
                        </div>
                        <UseUploadDragger control={control} name="myFile" multiple maxCount={3} />
                    </section>
                    <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">การตั้งค่าประมูล</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputNumber
                                control={control}
                                name="startPrice"
                                label="ราคาเริ่มต้น (บาท)"
                                size="large"
                                format
                                variant="filled"
                                icon={DollarOutlined}
                            />
                            <UseSelect
                                control={control}
                                name="auctionPeriod"
                                label="ระยะเวลาการประมูล"
                                options={[
                                    { value: "1", label: "Jack" },
                                    { value: "2", label: "Lucy" },
                                    { value: "3", label: "yiminghe" },
                                    { value: "4", label: "Disabled", disabled: true },
                                ]}
                                size="large"
                                variant="filled"
                            />
                        </div>
                    </section>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg sticky top-12">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                ตัวอย่างการแสดงผล
                            </span>
                            <EyeFilled className="text-lg text-gray-500!" />
                        </div>
                        <div className="aspect-video w-full bg-slate-100 relative">
                            <img
                                alt="Product preview"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC921Y5c16lE3ZMlaoy6xolPn0zfdw8gQ7IhtehHzvuwLAS92azbeaanRX37tIMm2AGX7oEMVCTbykL4Ckr1W_dQqsJIDkrxlNeQztkgrFlxh0lKa11D2lR73i5ZECD7v0bs7Gh0KbhDSSe79C3UPAReOuUR8xJ9nfOL7iIhXE1LeyJtLiNP34IcGV_XpyiyenoOExCdg0QOQDvT5tFimVFJIlQYqKA9MHXBZNfBxqss7zEPM3W-FQOtGgTBbgPDYlHi5IURJ5n8ik"
                            />
                            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase italic">
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
                                    <p className="text-xl font-bold text-primary">฿ 0</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">เวลาที่เหลือ</p>
                                    <p className="text-sm font-bold text-slate-900">-- : -- : --</p>
                                </div>
                            </div>
                            <UseCheckbox
                                control={control}
                                name="isSeller"
                                label="ผู้ขาย: บัญชีของคุณ"
                                className="text-xs! text-gray-500!"
                                // onChange={(e) => console.log("eeeeeeee", e.target.checked)}
                            />
                        </div>
                        <div className="p-5 flex flex-col gap-3 bg-slate-50">
                            <UseButton
                                label="ดำเนินการต่อ"
                                icon={ArrowRightOutlined}
                                iconPlacement
                                wFull
                                className="h-12!"
                            />
                            <UseButton label="บันทึกเป็นฉบับร่าง" type="default" wFull className="h-12!" />
                            <p className="text-[11px] text-center text-slate-400 px-4 leading-relaxed">
                                ในการดำเนินการต่อ คุณยอมรับนโยบายผู้ขายและโครงสร้างค่าธรรมเนียมของเรา
                            </p>
                        </div>
                        <div className="p-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-4">
                                    <SafetyOutlined className="text-lg" />
                                    Afferprice การันตีความปลอดภัย
                                </h4>
                                <ul className="flex flex-col gap-3">
                                    <li className="flex items-start gap-2">
                                        <CheckCircleFilled className="text-lg text text-green-600!" />
                                        <span className="text-[12px] text-slate-600">
                                            ระบบ Escrow คุ้มครองการชำระเงินสำหรับสินค้ามูลค่าสูง
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircleFilled className="text-lg text text-green-600!" />
                                        <span className="text-[12px] text-slate-600">
                                            สร้างใบปะหน้าพัสดุอัตโนมัติเมื่อมีการชำระเงิน
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircleFilled className="text-lg text text-green-600!" />
                                        <span className="text-[12px] text-slate-600">
                                            ทีมงานสนับสนุนข้อพิพาทโดยเฉพาะตลอด 24 ชม.
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Page;
