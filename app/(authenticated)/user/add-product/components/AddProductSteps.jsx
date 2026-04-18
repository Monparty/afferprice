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

    const dataConfig = {
        0: { step: "1", title: "อัปโหลดรูปภาพ", percentage: "0" },
        1: { step: "2", title: "ระบุรายละเอียดสินค้า", percentage: "25" },
        2: { step: "3", title: "ตรวจสอบข้อมูล", percentage: "50" },
        3: { step: "4", title: "ชำระค่าธรรมเนียม", percentage: "75" },
    };

    const { step, title, percentage } = dataConfig[activeStep] || {
        step: "0",
        title: "-",
        percentage: "0",
    };

    return (
        <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-accent">ขั้นตอนที่ {step} จาก 4</span>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm font-medium text-slate-600">{title}</span>
                </div>
                <span className="text-sm font-medium text-slate-400">สำเร็จแล้ว {percentage}%</span>
            </div>
            <UseSteps items={items} current={activeStep} />
        </div>
    );
}

export default AddProductSteps;
