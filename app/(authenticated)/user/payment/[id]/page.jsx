"use client";
import UseButton from "@/app/components/inputs/UseButton";
import {
    ArrowLeftOutlined,
    CheckCircleFilled,
    CreditCardFilled,
    DownloadOutlined,
    FileDoneOutlined,
    MessageFilled,
    MobileOutlined,
    WalletFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "@/app/lib/supabase/client";
import { apiPost } from "@/app/lib/api";
import { getAuctionResultById } from "@/app/services/payment.service";
import { getMyBidDeposit } from "@/app/services/deposits.service";
import { getMyWalletBalance } from "@/app/services/wallet.service";
import OmiseCardForm from "@/app/components/payment/OmiseCardForm";
import { startOmiseRedirect } from "@/app/components/payment/redirectPay";
import { setWalletBalance } from "@/app/features/user/userSlice";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";

const AUCTION_FEE_RATE = 0.05;

function formatPrice(n) {
    return `฿${Number(n).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
}

function Page() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const method = searchParams.get("method") || "promptpay";
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [walletBalance, setWalletBalanceLocal] = useState(0);
    const [result, setResult] = useState(null);
    const [qrData, setQrData] = useState(null);
    const [phone, setPhone] = useState("");
    const [redirecting, setRedirecting] = useState(false);
    const [walletSubmitting, setWalletSubmitting] = useState(false);
    const [deposit, setDeposit] = useState(null);

    // fetchUser ไม่ได้ถูก dispatch ทุกหน้า → โหลด user + balance ตรงจาก Supabase (pattern เดียวกับ checkout/wallet)
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            setUserId(user.id);
            getMyWalletBalance().then(({ data }) => {
                const bal = Number(data?.wallet_balance ?? 0);
                setWalletBalanceLocal(bal);
                dispatch(setWalletBalance(bal));
            });
        });
    }, [dispatch]);

    useEffect(() => {
        if (!id) return;
        getAuctionResultById(id).then(({ data, error }) => {
            if (error) return notifyError(error);
            setResult(data);
            // เงินมัดจำที่วางไว้ตอนประมูล (status='applied') — หักออกจากยอดชำระ
            if (data?.product_id) {
                getMyBidDeposit(data.product_id).then(({ data: dep }) => setDeposit(dep ?? null));
            }
        });
    }, [id]);

    useEffect(() => {
        if (method !== "promptpay") return;
        if (!result || !userId) return;
        const finalPrice = Number(result.final_price ?? 0);
        const total = Math.round(finalPrice + finalPrice * AUCTION_FEE_RATE);
        apiPost("/api/payment/promptpay", { auctionResultId: id })
            .then(setQrData)
            .catch(() => {});
    }, [result, userId, method, id]);

    const product = result?.products;
    const finalPrice = Number(result?.final_price ?? 0);
    const fee = Math.round(finalPrice * AUCTION_FEE_RATE);
    const shippingFee = Number(result?.shipping_fee ?? 0);
    const depositApplied = deposit?.status === "applied" ? Number(deposit.amount) : 0;
    const total = Math.max(0, finalPrice + fee + shippingFee - depositApplied);

    const handleWalletPay = async () => {
        if (!userId || !result) return;
        if (walletBalance < total) return router.push("/user/wallet");
        setWalletSubmitting(true);
        let d;
        try {
            d = await apiPost("/api/payment/wallet/charge", { auctionResultId: id });
        } catch (err) {
            setWalletSubmitting(false);
            return notifyError(err);
        }
        setWalletBalanceLocal(d.balance_after);
        dispatch(setWalletBalance(d.balance_after));
        notifySuccess("ชำระเงินสำเร็จ");
        router.push("/user/selling");
    };

    const handleCardToken = async (token) => {
        try {
            await apiPost("/api/payment/credit-card", { omiseToken: token, purpose: "auction", auctionResultId: id });
        } catch (err) {
            return notifyError(err);
        }
        notifySuccess("ส่งคำสั่งชำระเงินแล้ว กำลังตรวจสอบสถานะ");
        router.push("/user/selling");
    };

    // truemoney / rabbit_linepay → redirect ออกไป Omise (ไม่ reset redirecting ในเคสสำเร็จ)
    const handleRedirectPay = async (sourceType) => {
        if (sourceType === "truemoney" && !/^0\d{9}$/.test(phone)) {
            return notifyError("กรุณากรอกเบอร์ที่ผูกกับ TrueMoney (10 หลัก)");
        }
        setRedirecting(true);
        try {
            await startOmiseRedirect({ sourceType, purpose: "auction", auctionResultId: id, phoneNumber: phone });
        } catch (err) {
            notifyError(err);
            setRedirecting(false);
        }
    };

    return (
        <main className="grid place-items-center">
            <div className="w-fit space-y-6 text-center">
                <div className="grid place-items-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full">
                        <CheckCircleFilled className="text-2xl! text-green-600!" />
                    </div>
                    <p className="text-gray-500 dark:text-slate-400">
                        ขอบคุณสำหรับการประมูล รายการของคุณกำลังดำเนินการ
                    </p>
                </div>

                {method === "promptpay" && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-slate-300">
                                สแกนคิวอาร์โค้ดเพื่อชำระเงิน
                            </p>
                            <div className="bg-white p-4 rounded-lg border-2 border-gray-100 shadow-inner">
                                <div className="aspect-square w-48 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                    {qrData?.qrCodeUrl ? (
                                        <img src={qrData.qrCodeUrl} alt="PromptPay QR" className="w-full h-full" />
                                    ) : (
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%,rgba(0,0,0,0.05)_100%)] bg-size-[20px_20px] animate-pulse" />
                                    )}
                                </div>
                            </div>
                            <div className="w-full text-center space-y-1">
                                <p className="text-sm text-gray-500">ยอดชำระทั้งหมด</p>
                                <p className="text-3xl font-bold text-primary">{formatPrice(total)}</p>
                            </div>
                            <UseButton
                                label="บันทึกรูปภาพ"
                                icon={DownloadOutlined}
                                type="default"
                                className="h-12! text-base! font-bold!"
                                wFull
                            />
                        </div>
                    </div>
                )}

                {method === "credit_card" && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center w-20 h-20 bg-blue-50 dark:bg-blue-950/40 rounded-2xl">
                                <CreditCardFilled className="text-4xl! text-blue-500!" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-lg font-bold">บัตรเครดิต/เดบิต</p>
                                <p className="text-xs text-gray-400">ยอดชำระทั้งหมด {formatPrice(total)}</p>
                            </div>
                            <div className="w-full">
                                <OmiseCardForm
                                    amount={total}
                                    onToken={handleCardToken}
                                    submitLabel={`ชำระด้วยบัตร (${formatPrice(total)})`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {method === "truemoney" && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center w-20 h-20 bg-red-50 dark:bg-red-950/40 rounded-2xl">
                                <MobileOutlined className="text-4xl! text-red-500!" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-lg font-bold">TrueMoney Wallet</p>
                                <p className="text-xs text-gray-400">ยอดชำระทั้งหมด {formatPrice(total)}</p>
                            </div>
                            <input
                                className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                                placeholder="เบอร์โทร TrueMoney (เช่น 0812345678)"
                                inputMode="numeric"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <UseButton
                                label="ชำระผ่าน TrueMoney"
                                className="h-12! text-base! font-bold!"
                                onClick={() => handleRedirectPay("truemoney")}
                                loading={redirecting}
                                disabled={redirecting || !result}
                                wFull
                            />
                        </div>
                    </div>
                )}

                {method === "linepay" && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center w-20 h-20 bg-green-50 dark:bg-green-950/40 rounded-2xl">
                                <MessageFilled className="text-4xl! text-green-500!" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-lg font-bold">ชำระผ่าน Rabbit LINE Pay</p>
                                <p className="text-xs text-gray-400">กดปุ่มเพื่อไปยืนยันการชำระเงินในแอป LINE</p>
                            </div>
                            <div className="w-full text-center space-y-1 pt-2">
                                <p className="text-sm text-gray-500">ยอดชำระทั้งหมด</p>
                                <p className="text-3xl font-bold text-primary">{formatPrice(total)}</p>
                            </div>
                            <UseButton
                                label="เปิดแอป LINE เพื่อชำระเงิน"
                                className="h-12! text-base! font-bold! bg-green-500! border-green-500!"
                                onClick={() => handleRedirectPay("rabbit_linepay")}
                                loading={redirecting}
                                disabled={redirecting || !result}
                                wFull
                            />
                        </div>
                    </div>
                )}

                {method === "wallet" && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center justify-center w-20 h-20 bg-orange-50 dark:bg-orange-950/40 rounded-2xl">
                                <WalletFilled className="text-4xl! text-orange-500!" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-lg font-bold">ชำระด้วย Wallet</p>
                                <p className="text-xs text-gray-400">ตัดเงินจากยอดคงเหลือในบัญชี</p>
                            </div>
                            <div className="w-full bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">ยอดคงเหลือ</span>
                                    <span className="font-semibold">{formatPrice(walletBalance)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">ยอดที่ต้องชำระ</span>
                                    <span className="font-semibold text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>
                            {walletBalance < total && (
                                <p className="text-xs text-red-500">ยอดคงเหลือไม่เพียงพอ กรุณาเติมเงิน</p>
                            )}
                            <UseButton
                                label={walletBalance < total ? "เติมเงินเข้า Wallet" : "ยืนยันการชำระเงิน"}
                                className="h-12! text-base! font-bold!"
                                onClick={walletBalance < total ? () => router.push("/user/wallet") : handleWalletPay}
                                loading={walletSubmitting}
                                disabled={walletSubmitting || !result}
                                wFull
                            />
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-zinc-800 text-left">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <FileDoneOutlined className="text-xl! text-orange-600!" />
                        รายละเอียดการสั่งซื้อ
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-gray-500 text-sm">ชื่อสินค้า</span>
                            <span className="text-gray-900 dark:text-slate-100 text-sm font-semibold text-right">
                                {product?.title || "—"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">รหัสรายการ</span>
                            <span className="text-gray-900 dark:text-slate-100 text-sm font-mono uppercase">
                                {id ? `AR-${id.slice(0, 8).toUpperCase()}` : "—"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">ช่องทางชำระเงิน</span>
                            <span className="text-gray-900 dark:text-slate-100 text-sm font-semibold uppercase">
                                {method}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">ราคาชนะประมูล</span>
                            <span className="text-gray-900 dark:text-slate-100 text-sm font-semibold">
                                {formatPrice(finalPrice)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-500 text-sm">ค่าธรรมเนียม (5%)</span>
                            <span className="text-gray-900 dark:text-slate-100 text-sm font-semibold">
                                {formatPrice(fee)}
                            </span>
                        </div>
                        {shippingFee > 0 && (
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-500 text-sm">ค่าจัดส่ง</span>
                                <span className="text-gray-900 dark:text-slate-100 text-sm font-semibold">
                                    {formatPrice(shippingFee)}
                                </span>
                            </div>
                        )}
                        {depositApplied > 0 && (
                            <div className="flex justify-between items-center gap-4">
                                <span className="text-gray-500 text-sm">หักเงินมัดจำที่วางไว้</span>
                                <span className="text-emerald-600 text-sm font-semibold">
                                    −{formatPrice(depositApplied)}
                                </span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center gap-4">
                            <span className="text-gray-900 dark:text-slate-100 font-bold">ยอดชำระสุทธิ</span>
                            <span className="text-gray-900 dark:text-slate-100 font-bold text-lg">
                                {formatPrice(total)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <UseButton label="ไปที่การประมูลของฉัน" className="h-12! text-base! font-bold!" wFull />
                    <Link href="/">
                        <div className="text-sm flex gap-2 justify-center items-center">
                            <ArrowLeftOutlined /> กลับสู่หน้าหลัก
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default Page;
