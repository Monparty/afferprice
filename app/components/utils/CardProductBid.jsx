"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import InputNumber from "../inputs/InputNumber";
import UseButton from "../inputs/UseButton";
import {
    BankFilled,
    ClockCircleFilled,
    DollarOutlined,
    LockFilled,
    NotificationFilled,
    RiseOutlined,
} from "@ant-design/icons";
import { insertBid } from "@/app/services/bids.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";

function padTwo(n) {
    return String(n).padStart(2, "0");
}

function CardProductBid({ product }) {
    const { control, handleSubmit, setValue, watch } = useForm({ defaultValues: { bidPrice: null } });
    const user = useSelector((state) => state.user.data);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [ended, setEnded] = useState(false);

    useEffect(() => {
        if (!product?.auction_end_time) return;
        const tick = () => {
            const diff = new Date(product.auction_end_time) - new Date();
            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                setEnded(true);
                return;
            }
            const total = Math.floor(diff / 1000);
            setTimeLeft({
                hours: Math.floor(total / 3600),
                minutes: Math.floor((total % 3600) / 60),
                seconds: total % 60,
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [product?.auction_end_time]);

    const onQuickBid = (amount) => {
        const current = watch("bidPrice") || product?.start_price || 0;
        setValue("bidPrice", Number(current) + amount);
    };

    const onSubmit = async ({ bidPrice }) => {
        if (!user) {
            router.push("/login");
            return;
        }
        setLoading(true);
        const { error } = await insertBid({
            product_id: product.id,
            user_id: user.id,
            bid_price: bidPrice,
        });
        setLoading(false);
        if (error) return notifyError(error);
        notifySuccess("วางประมูลสำเร็จ");
    };

    const startPrice = product?.start_price;
    const formatPrice = (price) => (price ? `฿${Number(price).toLocaleString("th-TH")}` : "—");

    return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm font-medium">เวลาที่เหลือ:</span>
                    <div className="flex items-center gap-2 text-orange-600">
                        <ClockCircleFilled />
                        <span className="text-sm font-bold uppercase tracking-wider">
                            {ended ? "ปิดแล้ว" : "กำลังประมูล"}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between text-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">{padTwo(timeLeft.hours)}</span>
                        <span className="text-[10px] text-slate-400 uppercase">ชั่วโมง</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">{padTwo(timeLeft.minutes)}</span>
                        <span className="text-[10px] text-slate-400 uppercase">นาที</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">{padTwo(timeLeft.seconds)}</span>
                        <span className="text-[10px] text-slate-400 uppercase">วินาที</span>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">ราคาเริ่มต้น</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-extrabold text-primary">{formatPrice(startPrice)}</h2>
                        <span className="text-emerald-600 text-sm font-bold flex items-center">
                            <RiseOutlined />
                        </span>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        <UseButton
                            type="default"
                            label="+฿3,500"
                            className="font-bold! bg-gray-100!"
                            wFull
                            onClick={() => onQuickBid(3500)}
                        />
                        <UseButton
                            type="default"
                            label="+฿17,500"
                            className="font-bold! bg-gray-100!"
                            wFull
                            onClick={() => onQuickBid(17500)}
                        />
                        <UseButton
                            type="default"
                            label="+฿35,000"
                            className="font-bold! bg-gray-100!"
                            wFull
                            onClick={() => onQuickBid(35000)}
                        />
                    </div>
                    <InputNumber
                        control={control}
                        name="bidPrice"
                        className="h-14 text-lg! font-bold"
                        icon={DollarOutlined}
                        format
                        min={startPrice || 1}
                    />
                    <UseButton
                        label="วางประมูลทันที"
                        wFull
                        size="large"
                        icon={NotificationFilled}
                        iconPlacement
                        className="h-12! text-lg! font-bold!"
                        htmlType="submit"
                        loading={loading}
                        disabled={ended}
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
                </form>
            </div>
        </div>
    );
}

export default CardProductBid;
