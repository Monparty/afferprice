"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UsePopconfirm from "@/app/components/utils/UsePopconfirm";
import UseTag from "@/app/components/utils/UseTag";

function CardUserAddress({ onEditAddress }) {
    return (
        <div className="flex justify-between items-center gap-2 rounded-xl p-4 bg-white shadow-sm border border-slate-200">
            <div className="grid text-slate-500 text-sm">
                <div className="flex items-end gap-2 mb-1">
                    <h3 className="text-black text-base">ทดสอบ ทดสอบ</h3>
                    <div className="border-r border-slate-300 h-full"></div>
                    <p>094 303 0401</p>
                </div>
                <div>64/479 ทดสอบ</div>
                <div>ตำบลบางคูรัด, ทดสอบ, 11110</div>
                <UseTag label="ค่าเริ่มต้น" color="orange" className="w-fit! mt-1!" />
            </div>
            <div className="flex flex-col items-end gap-1">
                <UseButton label="ตั้งเป็นค่าเริ่มต้น" type="default" />
                <div className="flex gap-1">
                    <UseButton
                        label="แก้ไข"
                        type="text"
                        size="small"
                        className="text-orange-600!"
                        onClick={onEditAddress}
                    />
                    <UsePopconfirm onConfirm={() => {}} title="ยืนยันการลบ" description="ต้องการลบที่อยู่นี้ ?">
                        <UseButton label="ลบ" type="text" size="small" className="text-orange-600!" />
                    </UsePopconfirm>
                </div>
            </div>
        </div>
    );
}

export default CardUserAddress;
