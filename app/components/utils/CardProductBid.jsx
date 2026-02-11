"use client";
import { useForm } from "react-hook-form";
import InputNumber from "../inputs/InputNumber";
import InputText from "../inputs/InputText";
import UseButton from "../inputs/UseButton";
import {
    BankFilled,
    ClockCircleFilled,
    DollarOutlined,
    LockFilled,
    NotificationFilled,
    RiseOutlined,
} from "@ant-design/icons";

function CardProductBid() {
    const { handleSubmit, watch, control } = useForm({});
    return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm font-medium">เวลาที่เหลือ:</span>
                    <div className="flex items-center gap-2 text-orange-600">
                        <ClockCircleFilled />
                        <span className="text-sm font-bold uppercase tracking-wider">ปิดเร็วๆ นี้</span>
                    </div>
                </div>
                <div className="flex justify-between text-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">04</span>
                        <span className="text-[10px] text-slate-400 uppercase">ชั่วโมง</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">21</span>
                        <span className="text-[10px] text-slate-400 uppercase">นาที</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">38</span>
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
                    <p className="text-xs text-slate-400 mt-2">ถึงราคาขั้นต่ำแล้ว • ผู้ประมูลรวม 24 ราย</p>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        <UseButton type="default" label="+฿3,500" className="font-bold! bg-gray-100!" wFull />
                        <UseButton type="default" label="+฿17,500" className="font-bold! bg-gray-100!" wFull />
                        <UseButton type="default" label="+฿35,000" className="font-bold! bg-gray-100!" wFull />
                    </div>
                    <InputNumber
                        control={control}
                        name="bidPrice"
                        className="h-14 text-lg! font-bold"
                        icon={DollarOutlined}
                        format
                    />
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
    );
}

export default CardProductBid;
