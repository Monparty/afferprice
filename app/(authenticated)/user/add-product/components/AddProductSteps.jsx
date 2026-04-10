import React from "react";
import UseSteps from "@/app/components/utils/UseSteps";

function AddProductSteps({ activeStep }) {
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
            title: "ตรวจสอบข้อมูล",
        },
        {
            title: "ชำระค่าธรรมเนียม",
        },
    ];

    return (
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-accent">
                        ขั้นตอนที่ 
                        {{
                            0: "1",
                            1: "2",
                            2: "3",
                            3: "4",
                        }[activeStep] || "0"}
                         จาก 4
                    </span>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm font-medium text-slate-600">
                        {{
                            0: "อัปโหลดรูปภาพ",
                            1: "ระบุรายละเอียดสินค้า",
                            2: "ตรวจสอบข้อมูล",
                            3: "ชำระค่าธรรมเนียม",
                        }[activeStep] || "0"}
                    </span>
                </div>
                <span className="text-sm font-medium text-slate-400">
                    สำเร็จแล้ว{" "}
                    {{
                        0: "0",
                        1: "25",
                        2: "50",
                        3: "75",
                    }[activeStep] || "0"}
                    %
                </span>
            </div>
            <UseSteps items={items} current={activeStep} />
        </div>
    );
}

export default AddProductSteps;
