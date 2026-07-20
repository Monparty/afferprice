"use client";
import { Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    WalletFilled,
    PlusOutlined,
    QrcodeOutlined,
    MessageFilled,
    CreditCardFilled,
    MobileOutlined,
    ExperimentOutlined,
    BankOutlined,
    RollbackOutlined,
} from "@ant-design/icons";
import { Input } from "antd";
import UseButton from "@/app/components/inputs/UseButton";
import UseModal from "@/app/components/utils/UseModal";
import UseSkeleton from "@/app/components/utils/UseSkeleton";
import UseTag from "@/app/components/utils/UseTag";
import OmiseCardForm from "@/app/components/payment/OmiseCardForm";
import { startOmiseRedirect } from "@/app/components/payment/redirectPay";
import { supabase } from "@/app/lib/supabase/client";
import { apiPost } from "@/app/lib/api";
import {
    getMyWalletBalance,
    getMyTransactions,
    subscribeWallet,
    getMyWithdrawals,
    requestWithdrawal,
} from "@/app/services/wallet.service";
import { setWalletBalance } from "@/app/features/user/userSlice";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { useRouter, useSearchParams } from "next/navigation";

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

const METHODS = [
    { value: "promptpay", label: "PromptPay", icon: QrcodeOutlined, color: "text-black! dark:text-white!" },
    { value: "credit_card", label: "บัตร", icon: CreditCardFilled, color: "text-blue-500!" },
    { value: "truemoney", label: "TrueMoney", icon: MobileOutlined, color: "text-red-500!" },
    { value: "linepay", label: "LINE Pay", icon: MessageFilled, color: "text-green-500!" },
    // ช่องทางเทสชั่วคราว — เติมเงินเข้า wallet ตรง (dev เท่านั้น, route ปิดเองบน production)
    // ...(process.env.NODE_ENV !== "production"
    //     ? [{ value: "test", label: "Test", icon: ExperimentOutlined, color: "text-purple-500!" }]
    //     : []),
    { value: "test", label: "Test", icon: ExperimentOutlined, color: "text-purple-500!" },
];

function formatPrice(n) {
    return `฿${Number(n).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;
}

function formatDate(s) {
    return new Date(s).toLocaleString("th-TH");
}

function TopupModal({ open, onClose, userId }) {
    const [amount, setAmount] = useState(100);
    const [method, setMethod] = useState("promptpay");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);

    const reset = () => {
        setAmount(100);
        setMethod("promptpay");
        setPhone("");
        setQrData(null);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async () => {
        if (!amount || amount < 1) return notifyError("กรุณาระบุจำนวนเงิน");
        setLoading(true);
        try {
            if (method === "promptpay") {
                const d = await apiPost("/api/payment/promptpay", { amount, purpose: "topup" });
                setQrData(d);
            } else if (method === "truemoney") {
                if (!/^0\d{9}$/.test(phone)) return notifyError("กรุณากรอกเบอร์ที่ผูกกับ TrueMoney (10 หลัก)");
                await startOmiseRedirect({ sourceType: "truemoney", purpose: "topup", amount, phoneNumber: phone });
            } else if (method === "linepay") {
                await startOmiseRedirect({ sourceType: "rabbit_linepay", purpose: "topup", amount });
            } else if (method === "test") {
                await apiPost("/api/payment/test-topup", { amount });
                notifySuccess(`เติมเงินทดสอบสำเร็จ ${formatPrice(amount)}`);
                handleClose();
            }
        } catch (err) {
            notifyError(err);
        } finally {
            setLoading(false);
        }
    };

    // บัตรเครดิต/เดบิต topup — charge ตรง แล้ว webhook เครดิต wallet ภายหลัง
    const handleCardToken = async (token) => {
        try {
            await apiPost("/api/payment/credit-card", { omiseToken: token, purpose: "topup", amount });
        } catch (err) {
            return notifyError(err);
        }
        notifySuccess("ส่งคำสั่งเติมเงินแล้ว ยอดจะอัปเดตเมื่อชำระสำเร็จ");
        handleClose();
    };

    return (
        <UseModal open={open} onCancel={handleClose} title="เติมเงินเข้ากระเป๋า" isShowCancel={false}>
            {qrData?.qrCodeUrl ? (
                <div className="flex flex-col items-center gap-3 py-2">
                    <p className="text-sm text-gray-500">สแกน QR เพื่อชำระเงิน</p>
                    <p className="text-2xl font-bold text-orange-600">{formatPrice(amount)}</p>
                    <img src={qrData.qrCodeUrl} alt="PromptPay QR" className="w-64 h-64" />
                    <p className="text-xs text-gray-400">
                        หมดอายุ: {new Date(qrData.expiresAt).toLocaleString("th-TH")}
                    </p>
                    <p className="text-xs text-gray-500 text-center max-w-sm">
                        หลังชำระเงินสำเร็จ ยอดในกระเป๋าจะอัปเดตอัตโนมัติ (อาจใช้เวลาไม่กี่วินาที)
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 py-2">
                    <div>
                        <p className="text-sm font-semibold mb-2">จำนวนเงิน (บาท)</p>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {PRESET_AMOUNTS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setAmount(p)}
                                    className={`py-2 rounded-lg border-2 text-sm font-semibold transition-colors ${
                                        amount === p
                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                                            : "border-gray-200 dark:border-zinc-700 hover:border-orange-300"
                                    }`}
                                >
                                    ฿{p.toLocaleString()}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min={1}
                            placeholder="ระบุจำนวนเอง"
                            className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-2">ช่องทางชำระเงิน</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {METHODS.map((m) => {
                                const Icon = m.icon;
                                const selected = method === m.value;
                                return (
                                    <button
                                        key={m.value}
                                        onClick={() => setMethod(m.value)}
                                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 transition-colors ${
                                            selected
                                                ? "border-orange-500 bg-orange-50 dark:bg-orange-950/40"
                                                : "border-gray-200 dark:border-zinc-700 hover:border-orange-300"
                                        }`}
                                    >
                                        <Icon className={`text-2xl! ${m.color}`} />
                                        <span className="text-xs font-semibold">{m.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {method === "truemoney" && (
                        <input
                            className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                            placeholder="เบอร์โทร TrueMoney (เช่น 0812345678)"
                            inputMode="numeric"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    )}

                    {method === "credit_card" ? (
                        <OmiseCardForm
                            amount={amount}
                            onToken={handleCardToken}
                            submitLabel={`เติมเงินด้วยบัตร (${formatPrice(amount)})`}
                        />
                    ) : (
                        <UseButton
                            label="ดำเนินการชำระเงิน"
                            className="h-11! font-bold!"
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={loading}
                            wFull
                        />
                    )}
                </div>
            )}
        </UseModal>
    );
}

function TransactionRow({ tx }) {
    const isCredit = tx.amount > 0;
    const labelMap = {
        topup: "เติมเงิน",
        payment: "ชำระค่าประมูล",
        refund: "คืนเงิน",
        sale: "รายได้จากการขาย",
        withdrawal: "ถอนเงิน",
    };
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {labelMap[tx.type] || tx.type}
                </span>
                <span className="text-xs text-gray-400">{formatDate(tx.created_at)}</span>
                {tx.note && <span className="text-xs text-gray-500 dark:text-slate-400">{tx.note}</span>}
            </div>
            <div className="text-right">
                <div className={`text-base font-bold ${isCredit ? "text-green-600" : "text-red-500"}`}>
                    {isCredit ? "+" : ""}
                    {formatPrice(tx.amount)}
                </div>
                <div className="text-xs text-gray-400">คงเหลือ {formatPrice(tx.balance_after)}</div>
            </div>
        </div>
    );
}

const WITHDRAW_MIN = 100;
const WD_STATUS = {
    pending: { label: "รอดำเนินการ", color: "gold" },
    paid: { label: "จ่ายแล้ว", color: "green" },
    rejected: { label: "ปฏิเสธ", color: "red" },
};

function WithdrawModal({ open, onClose, balance, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const n = Number(amount);
    const invalid = !Number.isFinite(n) || n < WITHDRAW_MIN || n > balance;

    const handleSubmit = async () => {
        if (invalid) return;
        setSubmitting(true);
        const { error } = await requestWithdrawal(Math.round(n));
        setSubmitting(false);
        if (error) return notifyError(error);
        notifySuccess("ส่งคำขอถอนเงินแล้ว รอผู้ดูแลระบบดำเนินการ");
        setAmount("");
        onSuccess?.();
        onClose();
    };

    return (
        <UseModal title="ถอนเงิน" open={open} onCancel={onClose}>
            <div className="grid gap-4">
                <p className="text-sm text-gray-500">
                    ยอดคงเหลือ <span className="font-bold text-orange-600">{formatPrice(balance)}</span> — ถอนขั้นต่ำ ฿
                    {WITHDRAW_MIN.toLocaleString()}
                </p>
                <div className="grid gap-1">
                    <label className="text-sm font-semibold">จำนวนเงินที่ต้องการถอน</label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`ระบุจำนวนเงิน (สูงสุด ${balance.toLocaleString()})`}
                        prefix="฿"
                    />
                    {amount !== "" && invalid && (
                        <span className="text-xs text-red-500">
                            {n > balance ? "ยอดเงินไม่เพียงพอ" : `ถอนขั้นต่ำ ฿${WITHDRAW_MIN.toLocaleString()}`}
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-400">
                    ระบบจะโอนเงินเข้าบัญชีธนาคารที่คุณให้ไว้ตอนยืนยันตัวตน (KYC) หลังผู้ดูแลระบบตรวจสอบ
                </p>
                <UseButton
                    label="ยืนยันการถอนเงิน"
                    icon={BankOutlined}
                    wFull
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={invalid || submitting}
                />
            </div>
        </UseModal>
    );
}

function WalletContent() {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [loadingTx, setLoadingTx] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [withdrawOpen, setWithdrawOpen] = useState(false);

    const searchParams = useSearchParams();
    const productId = searchParams.get("productId") || null;
    const router = useRouter();

    const refresh = async () => {
        const [balRes, txRes, wdRes] = await Promise.all([
            getMyWalletBalance(),
            getMyTransactions(),
            getMyWithdrawals(),
        ]);
        const bal = Number(balRes.data?.wallet_balance ?? 0);
        setBalance(bal);
        dispatch(setWalletBalance(bal));
        if (txRes.error) notifyError(txRes.error);
        else setTransactions(txRes.data ?? []);
        if (!wdRes.error) setWithdrawals(wdRes.data ?? []);
        setLoadingTx(false);
    };

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUserId(data?.user?.id ?? null));
    }, []);

    useEffect(() => {
        if (!userId) return;
        refresh();
        const unsub = subscribeWallet(userId, () => refresh());
        return unsub;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    return (
        <main className="max-w-3xl mx-auto flex flex-col gap-6">
            <div className="rounded-2xl p-6 bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-xs uppercase tracking-wider opacity-80">ยอดเงินคงเหลือ</p>
                        <p className="text-4xl font-bold mt-2">{formatPrice(balance)}</p>
                    </div>
                    <WalletFilled className="text-3xl! opacity-80" />
                </div>
                <div className="flex gap-3">
                    <UseButton
                        label="เติมเงิน"
                        icon={PlusOutlined}
                        className="text-orange-600!"
                        type="default"
                        size="large"
                        onClick={() => setModalOpen(true)}
                    />
                    {productId && (
                        <UseButton
                            label="กลับหน้าชำระเงิน"
                            icon={RollbackOutlined}
                            className="bg-orange-700/30! border-white/40! text-white!"
                            type="default"
                            size="large"
                            onClick={() => router.back()}
                        />
                    )}
                    {balance > 0 && (
                        <UseButton
                            label="ถอนเงิน"
                            icon={BankOutlined}
                            className="bg-orange-700/30! border-white/40! text-white!"
                            type="default"
                            size="large"
                            onClick={() => setWithdrawOpen(true)}
                        />
                    )}
                </div>
            </div>

            {withdrawals.length > 0 && (
                <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
                    <h2 className="text-lg font-bold mb-2">คำขอถอนเงิน</h2>
                    <div>
                        {withdrawals.map((wd) => {
                            const st = WD_STATUS[wd.status] || { label: wd.status, color: "default" };
                            return (
                                <div
                                    key={wd.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-semibold">{formatPrice(wd.amount)}</span>
                                        <span className="text-xs text-gray-400">{formatDate(wd.created_at)}</span>
                                        {wd.status === "rejected" && wd.admin_note && (
                                            <span className="text-xs text-red-500">{wd.admin_note}</span>
                                        )}
                                    </div>
                                    <UseTag label={st.label} color={st.color} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm p-6">
                <h2 className="text-lg font-bold mb-2">ประวัติการทำรายการ</h2>
                {loadingTx ? (
                    <div className="grid gap-3">
                        <UseSkeleton />
                        <UseSkeleton />
                    </div>
                ) : transactions.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">ยังไม่มีรายการ</p>
                ) : (
                    <div>
                        {transactions.map((tx) => (
                            <TransactionRow key={tx.id} tx={tx} />
                        ))}
                    </div>
                )}
            </div>

            <TopupModal open={modalOpen} onClose={() => setModalOpen(false)} userId={userId} />
            <WithdrawModal
                open={withdrawOpen}
                onClose={() => setWithdrawOpen(false)}
                balance={balance}
                onSuccess={refresh}
            />
        </main>
    );
}

function Page() {
    return (
        <Suspense fallback={null}>
            <WalletContent />
        </Suspense>
    );
}

export default Page;
