"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
import { updateProductPrice } from "@/app/services/products.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { fetchUser } from "@/app/features/user/userSlice";

function padTwo(n) {
    return String(n).padStart(2, "0");
}

function CardProductBid({ product, onBidSuccess }) {
    const { control, handleSubmit, setValue, watch } = useForm({ defaultValues: { bidPrice: null } });
    const dispatch = useDispatch();
    const { data: userData, loading: userLoading, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [ended, setEnded] = useState(false);
    const [currentPrice, setCurrentPrice] = useState(product?.start_price);

    useEffect(() => {
        if (product?.start_price) setCurrentPrice(product.start_price);
    }, [product?.start_price]);

    useEffect(() => {
        if (!ended || !product?.id) return;
        fetch("/api/auction/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
        });
    }, [ended, product?.id]);

    useEffect(() => {
        if (!product?.auction_end_time) return;
        const tick = () => {
            const diff = new Date(product.auction_end_time) - new Date();
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setEnded(true);
                return;
            }
            const total = Math.floor(diff / 1000);
            setTimeLeft({
                days: Math.floor(total / 86400),
                hours: Math.floor((total % 86400) / 3600),
                minutes: Math.floor((total % 3600) / 60),
                seconds: total % 60,
            });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [product?.auction_end_time]);

    const onQuickBid = (amount) => {
        const current = watch("bidPrice") || currentPrice || 0;
        setValue("bidPrice", Number(current) + amount);
    };

    const onSubmit = async ({ bidPrice }) => {
        if (!userData) {
            router.push("/login");
            return;
        }
        setLoading(true);
        const { error } = await insertBid({
            product_id: product.id,
            user_id: userData.id,
            bid_price: bidPrice,
        });
        setLoading(false);
        if (error) return notifyError(error);
        await updateProductPrice(product.id, bidPrice);
        setCurrentPrice(bidPrice);
        onBidSuccess?.();
        notifySuccess("วางประมูลสำเร็จ");
    };

    const formatPrice = (price) => (price ? `฿${Number(price).toLocaleString("th-TH")}` : "—");
    const quickSteps = [0.1, 0.2, 0.3].map((pct) => Math.round((currentPrice || 0) * pct));
    const bidPrice = watch("bidPrice");
    const isBelowMin = !bidPrice || Number(bidPrice) < (currentPrice || 0);

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
                {timeLeft.days > 0 && (
                    <div className="text-center text-sm text-slate-400 pt-4">จะหมดเวลาในอีก {timeLeft.days} วัน</div>
                )}
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">ราคาปัจจุบัน</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-extrabold text-primary">{formatPrice(currentPrice)}</h2>
                        <span className="text-emerald-600 text-sm font-bold flex items-center">
                            <RiseOutlined />
                        </span>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        {quickSteps.map((step, i) => (
                            <UseButton
                                key={i}
                                type="default"
                                label={`+${formatPrice(step)}`}
                                className="font-bold! bg-gray-100!"
                                wFull
                                onClick={() => onQuickBid(step)}
                            />
                        ))}
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
                        className="h-12! text-lg! font-bold!"
                        htmlType="submit"
                        loading={loading}
                        disabled={ended || isBelowMin}
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
