"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import verifiedIcon from "../../../public/images/verifiedIcon.png";
import { ArrowLeftOutlined, ArrowRightOutlined, CheckCircleFilled, EyeFilled } from "@ant-design/icons";
import Image from "next/image";

function CardAddProductPreview({ control, watch, activeStep, setActiveStep }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-lg sticky top-12">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ตัวอย่างการแสดงผล</span>
                    <EyeFilled className="text-lg text-gray-500!" />
                </div>
                <div className="aspect-video w-full bg-slate-100 relative">
                    <img
                        alt="Product preview"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC921Y5c16lE3ZMlaoy6xolPn0zfdw8gQ7IhtehHzvuwLAS92azbeaanRX37tIMm2AGX7oEMVCTbykL4Ckr1W_dQqsJIDkrxlNeQztkgrFlxh0lKa11D2lR73i5ZECD7v0bs7Gh0KbhDSSe79C3UPAReOuUR8xJ9nfOL7iIhXE1LeyJtLiNP34IcGV_XpyiyenoOExCdg0QOQDvT5tFimVFJIlQYqKA9MHXBZNfBxqss7zEPM3W-FQOtGgTBbgPDYlHi5IURJ5n8ik"
                    />
                    <div className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                        กำลังเริ่มเร็วๆ นี้
                    </div>
                    <div className="absolute top-2 left-2">
                        <Image src={verifiedIcon} width={28} height={28} alt="Afferprice Logo" />
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 truncate">
                        {watch("title") || "ชื่อรายการสินค้าของคุณจะแสดงที่นี่..."}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">ราคาเริ่มต้น</p>
                            <p className="text-xl font-bold text-primary">
                                ฿{watch("startPrice")?.toLocaleString() || "0"}{" "}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">เวลาที่เหลือ</p>
                            <p className="text-sm font-bold text-slate-900">
                                {{
                                    1: "24:00:00",
                                    2: "5 วัน 24:00:00",
                                    3: "7 วัน 24:00:00",
                                    4: "10 วัน 24:00:00",
                                }[watch("periodBid")] || "00:00:00"}
                            </p>
                        </div>
                    </div>
                    <UseCheckbox
                        control={control}
                        name="isSeller"
                        label="ผู้ขาย: บัญชีของคุณ"
                        className="text-xs! text-gray-500!"
                    />
                </div>
                <div className="p-5 flex flex-col gap-3 bg-slate-50">
                    <UseButton
                        label="ดำเนินการต่อ"
                        icon={ArrowRightOutlined}
                        iconPlacement
                        wFull
                        className="h-12!"
                        onClick={() => {
                            if (activeStep === 2) return;
                            setActiveStep(activeStep + 1);
                        }}
                    />
                    {activeStep !== 0 && (
                        <UseButton
                            label="ย้อนกลับ"
                            icon={ArrowLeftOutlined}
                            wFull
                            className="h-12!"
                            type="default"
                            onClick={() => {
                                if (activeStep === 0) return;
                                setActiveStep(activeStep - 1);
                            }}
                        />
                    )}
                    <UseButton label="บันทึกเป็นฉบับร่าง" type="default" wFull className="h-12!" />
                    <p className="text-[11px] text-center text-slate-400 px-4 leading-relaxed">
                        ในการดำเนินการต่อ คุณยอมรับนโยบายผู้ขายและโครงสร้างค่าธรรมเนียมของเรา
                    </p>
                </div>
                <div className="p-4">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                        <h4 className="text-sm font-bold text-orange-600 flex items-center gap-2 mb-3">
                            Afferprice การันตีความปลอดภัย
                        </h4>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-start gap-2">
                                <CheckCircleFilled className="text-lg text text-orange-600!" />
                                <span className="text-[12px] text-slate-600">
                                    ระบบ Escrow คุ้มครองการชำระเงินสำหรับสินค้ามูลค่าสูง
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircleFilled className="text-lg text text-orange-600!" />
                                <span className="text-[12px] text-slate-600">
                                    สร้างใบปะหน้าพัสดุอัตโนมัติเมื่อมีการชำระเงิน
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircleFilled className="text-lg text text-orange-600!" />
                                <span className="text-[12px] text-slate-600">
                                    ทีมงานสนับสนุนข้อพิพาทโดยเฉพาะตลอด 24 ชม.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardAddProductPreview;
