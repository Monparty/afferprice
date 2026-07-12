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
    SafetyCertificateFilled,
    WalletFilled,
} from "@ant-design/icons";
import { insertBid, getHighestBid, subscribeBidChannel, sendBidBroadcast } from "@/app/services/bids.service";
import { getMyBidDeposit, placeBidDeposit } from "@/app/services/deposits.service";
import { getMyWalletBalance } from "@/app/services/wallet.service";
import { apiPost } from "@/app/lib/api";
import { updateProductPrice } from "@/app/services/products.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { fetchUser } from "@/app/features/user/userSlice";
import UseModal from "./UseModal";
import KycVerificationForm from "@/app/(authenticated)/user/components/KycVerificationForm";

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
    const [highestBidderId, setHighestBidderId] = useState(null);
    const [kycModalOpen, setKycModalOpen] = useState(false);
    const [deposit, setDeposit] = useState(null);
    const [depositLoading, setDepositLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState(null);

    // เงินมัดจำของ user สำหรับสินค้านี้ + ยอด wallet (ไว้เช็คว่าพอวางมัดจำไหม)
    useEffect(() => {
        if (!userData?.id || !product?.id) return;
        getMyBidDeposit(product.id).then(({ data }) => setDeposit(data ?? null));
        getMyWalletBalance().then(({ data }) => {
            if (data) setWalletBalance(Number(data.wallet_balance ?? 0));
        });
    }, [userData?.id, product?.id]);

    useEffect(() => {
        if (product?.start_price) setCurrentPrice(product.start_price);
    }, [product?.start_price]);

    useEffect(() => {
        if (!product?.id) return;
        getHighestBid(product.id).then(({ data }) => {
            if (data?.bid_price) setCurrentPrice(data.bid_price);
            if (data?.user_id) setHighestBidderId(data.user_id);
        });
        return subscribeBidChannel(product.id, (payload) => {
            setCurrentPrice(payload.price);
            if (payload.userId) setHighestBidderId(payload.userId);
        });
    }, [product?.id]);

    useEffect(() => {
        if (!ended || !product?.id) return;
        apiPost("/api/auction/end", { productId: product.id }).catch(() => {});
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
        if (userData.is_kyc !== "approved") {
            setKycModalOpen(true);
            return;
        }
        if (deposit?.status !== "held") {
            return notifyError({ message: "deposit_required" });
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
        setHighestBidderId(userData.id);
        sendBidBroadcast(product.id, { price: bidPrice, userId: userData.id });
        onBidSuccess?.();
        setValue("bidPrice", null);
        notifySuccess("วางประมูลสำเร็จ");
    };

    const formatPrice = (price) => (price ? `฿${Number(price).toLocaleString("th-TH")}` : "—");
    const quickSteps = [0.1, 0.2, 0.3].map((pct) => Math.round((currentPrice || 0) * pct));
    const bidPrice = watch("bidPrice");
    const isBelowMin = !bidPrice || Number(bidPrice) <= (currentPrice || 0);
    // เงื่อนไขผู้ขายห้ามประมูลสินค้าตัวเอง
    const isSeller = userData?.id === product?.seller_id;
    // ผู้ที่ประมูลสูงสุดอยู่ตอนนี้ ต้องรอผู้อื่นมาประมูลก่อนถึงจะประมูลต่อได้
    const isHighestBidder = !!userData?.id && userData.id === highestBidderId;
    // ต้องยืนยันตัวตน (KYC) ก่อนจึงจะประมูลได้
    const needKyc = !!userData?.id && !isSeller && userData.is_kyc !== "approved";
    // KYC ส่งแล้วรอ admin ตรวจสอบ — ยังประมูลไม่ได้ แต่ไม่ต้องเปิดฟอร์ม KYC ซ้ำ
    const isKycPending = userData?.is_kyc === "pending";
    // ประมูลครั้งแรกต้องวางเงินมัดจำ 20% ของราคาปัจจุบันก่อน (ยอดจริงคำนวณฝั่ง server)
    const hasDeposit = deposit?.status === "held";
    const depositAmount = Math.max(1, Math.round((currentPrice || 0) * 0.2));
    const needDeposit = !!userData?.id && !isSeller && !needKyc && !hasDeposit;
    const insufficientForDeposit = walletBalance !== null && walletBalance < depositAmount;

    const onPlaceDeposit = async () => {
        setDepositLoading(true);
        const { data, error } = await placeBidDeposit(product.id);
        setDepositLoading(false);
        if (error) return notifyError(error);
        setDeposit({ id: data.deposit_id, amount: data.amount, status: "held" });
        setWalletBalance(Number(data.balance_after));
        notifySuccess("วางเงินมัดจำสำเร็จ เริ่มประมูลได้เลย");
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
            <div className="p-6 bg-slate-900 dark:bg-zinc-950 text-white">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm font-medium">เวลาที่เหลือ:</span>
                    <div className="flex items-center gap-2 text-orange-600">
                        <ClockCircleFilled />
                        <span className="text-sm font-bold tracking-wider">
                            {ended ? "ปิดแล้ว" : "กำลังประมูล"}
                        </span>
                    </div>
                </div>
                <div className="flex justify-between text-center gap-4">
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">{padTwo(timeLeft.hours)}</span>
                        <span className="text-[10px] text-slate-400">ชั่วโมง</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">{padTwo(timeLeft.minutes)}</span>
                        <span className="text-[10px] text-slate-400">นาที</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-bold text-orange-600">{padTwo(timeLeft.seconds)}</span>
                        <span className="text-[10px] text-slate-400">วินาที</span>
                    </div>
                </div>
                {timeLeft.days > 0 && (
                    <div className="flex justify-center">
                        <div className="text-center font-bold mt-4 text-orange-600 bg-white/10 py-1 px-6 w-fit rounded-lg">
                            จะหมดเวลาในอีก {timeLeft.days} วัน
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">ราคาปัจจุบัน</p>
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
                                className="font-bold! bg-gray-100! dark:bg-zinc-700!"
                                wFull
                                onClick={() => onQuickBid(step)}
                                disabled={ended}
                            />
                        ))}
                    </div>
                    <InputNumber
                        control={control}
                        name="bidPrice"
                        className="h-14 text-lg! font-bold"
                        icon={DollarOutlined}
                        format
                        placeholder="ระบุราคา..."
                        disabled={ended}
                    />
                    {needKyc ? (
                        <UseButton
                            label={isKycPending ? "รอตรวจสอบการยืนยันตัวตน" : "ยืนยันตัวตนก่อนประมูล"}
                            wFull
                            size="large"
                            icon={SafetyCertificateFilled}
                            iconPlacement
                            className="h-12! text-lg! font-bold!"
                            type="default"
                            disabled={ended || isKycPending}
                            onClick={isKycPending ? undefined : () => setKycModalOpen(true)}
                        />
                    ) : needDeposit ? (
                        <div className="space-y-2">
                            <UseButton
                                label={
                                    insufficientForDeposit
                                        ? `เติมเงินเพื่อวางมัดจำ (${formatPrice(depositAmount)})`
                                        : `วางเงินมัดจำ 20% (${formatPrice(depositAmount)})`
                                }
                                wFull
                                size="large"
                                icon={WalletFilled}
                                iconPlacement
                                className="h-12! text-lg! font-bold!"
                                type="default"
                                disabled={ended}
                                loading={depositLoading}
                                onClick={insufficientForDeposit ? () => router.push("/user/wallet") : onPlaceDeposit}
                            />
                            <p className="text-xs text-slate-400 text-center">
                                ประมูลครั้งแรกต้องวางเงินมัดจำ 20% ของราคาปัจจุบัน — หากไม่ชนะระบบคืนเงินเข้ากระเป๋าอัตโนมัติ
                            </p>
                        </div>
                    ) : (
                        <>
                            {hasDeposit && (
                                <p className="text-xs text-emerald-600 text-center">
                                    วางเงินมัดจำแล้ว {formatPrice(Number(deposit.amount))} — หากไม่ชนะระบบคืนเงินอัตโนมัติ
                                </p>
                            )}
                            <UseButton
                                label={isHighestBidder ? "รอผู้อื่นเสนอราคา" : "วางประมูลทันที"}
                                wFull
                                size="large"
                                icon={NotificationFilled}
                                iconPlacement
                                className="h-12! text-lg! font-bold!"
                                htmlType="submit"
                                loading={loading}
                                disabled={ended || isBelowMin || isSeller || isHighestBidder}
                            />
                        </>
                    )}
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

            <UseModal
                open={kycModalOpen}
                onCancel={() => setKycModalOpen(false)}
                title="ยืนยันตัวตน (KYC)"
                isShowCancel={false}
            >
                <KycVerificationForm
                    setIsOpenModalProfile={setKycModalOpen}
                    onKycSubmitted={() => setKycModalOpen(false)}
                    onSubmitSaveProduct={() => {}}
                />
            </UseModal>
        </div>
    );
}

export default CardProductBid;
