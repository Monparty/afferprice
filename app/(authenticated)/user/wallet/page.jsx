"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { WalletFilled, PlusOutlined, QrcodeOutlined, MessageFilled, CreditCardFilled } from "@ant-design/icons";
import UseButton from "@/app/components/inputs/UseButton";
import UseModal from "@/app/components/utils/UseModal";
import UseSkeleton from "@/app/components/utils/UseSkeleton";
import { supabase } from "@/app/lib/supabase/client";
import {
    getMyWalletBalance,
    getMyTransactions,
    subscribeWallet,
} from "@/app/services/wallet.service";
import { setWalletBalance } from "@/app/features/user/userSlice";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

const METHODS = [
    { value: "promptpay", label: "PromptPay", icon: QrcodeOutlined, color: "text-black!" },
    { value: "linepay", label: "LINE Pay", icon: MessageFilled, color: "text-green-500!" },
    { value: "credit_card", label: "บัตรเครดิต", icon: CreditCardFilled, color: "text-blue-500!" },
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
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);
    const [linepayPending, setLinepayPending] = useState(null);

    const reset = () => {
        setAmount(100);
        setMethod("promptpay");
        setQrData(null);
        setLinepayPending(null);
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
                const r = await fetch("/api/payment/promptpay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, purpose: "topup" }),
                });
                const d = await r.json();
                if (d.error) return notifyError(d.error);
                setQrData(d);
            } else if (method === "linepay") {
                const r = await fetch("/api/payment/linepay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount, purpose: "topup" }),
                });
                const d = await r.json();
                if (d.error) return notifyError(d.error);
                setLinepayPending(d);
            } else if (method === "credit_card") {
                notifyError("ระบบบัตรเครดิตอยู่ระหว่างเชื่อมต่อ — กรุณาเลือกช่องทางอื่น");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLinepayConfirm = async () => {
        if (!linepayPending?.chargeId) return;
        setLoading(true);
        const r = await fetch("/api/payment/linepay/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chargeId: linepayPending.chargeId }),
        });
        const d = await r.json();
        setLoading(false);
        if (d.error) return notifyError(d.error);
        notifySuccess("เติมเงินสำเร็จ");
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
            ) : linepayPending ? (
                <div className="flex flex-col items-center gap-3 py-2">
                    <div className="flex items-center justify-center w-20 h-20 bg-green-50 rounded-2xl">
                        <MessageFilled className="text-4xl! text-green-500!" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(amount)}</p>
                    <p className="text-sm text-gray-500">เปิดแอป LINE เพื่อยืนยันการชำระ (mock)</p>
                    <UseButton
                        label="ยืนยันการชำระเงิน (mock)"
                        className="h-11! bg-green-500! border-green-500!"
                        onClick={handleLinepayConfirm}
                        loading={loading}
                        wFull
                    />
                </div>
            ) : loading ? (
                <UseSkeleton />
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
                                            ? "border-orange-500 bg-orange-50 text-orange-600"
                                            : "border-gray-200 hover:border-orange-300"
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-2">ช่องทางชำระเงิน</p>
                        <div className="grid grid-cols-3 gap-2">
                            {METHODS.map((m) => {
                                const Icon = m.icon;
                                const selected = method === m.value;
                                return (
                                    <button
                                        key={m.value}
                                        onClick={() => setMethod(m.value)}
                                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-lg border-2 transition-colors ${
                                            selected
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-200 hover:border-orange-300"
                                        }`}
                                    >
                                        <Icon className={`text-2xl! ${m.color}`} />
                                        <span className="text-xs font-semibold">{m.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <UseButton
                        label="ดำเนินการชำระเงิน"
                        className="h-11! font-bold!"
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={loading}
                        wFull
                    />
                </div>
            )}
        </UseModal>
    );
}

function TransactionRow({ tx }) {
    const isCredit = tx.amount > 0;
    const labelMap = { topup: "เติมเงิน", payment: "ชำระค่าประมูล", refund: "คืนเงิน" };
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-gray-900">{labelMap[tx.type] || tx.type}</span>
                <span className="text-xs text-gray-400">{formatDate(tx.created_at)}</span>
                {tx.note && <span className="text-xs text-gray-500">{tx.note}</span>}
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

function Page() {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(null);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loadingTx, setLoadingTx] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const refresh = async () => {
        const [balRes, txRes] = await Promise.all([getMyWalletBalance(), getMyTransactions()]);
        const bal = Number(balRes.data?.wallet_balance ?? 0);
        setBalance(bal);
        dispatch(setWalletBalance(bal));
        if (txRes.error) notifyError(txRes.error);
        else setTransactions(txRes.data ?? []);
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
            <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-xs uppercase tracking-wider opacity-80">ยอดเงินคงเหลือ</p>
                        <p className="text-4xl font-bold mt-2">{formatPrice(balance)}</p>
                    </div>
                    <WalletFilled className="text-3xl! opacity-80" />
                </div>
                <UseButton
                    label="เติมเงิน"
                    icon={PlusOutlined}
                    className="bg-white! text-orange-600! border-0! font-bold! h-11!"
                    onClick={() => setModalOpen(true)}
                />
            </div>

            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6">
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
        </main>
    );
}

export default Page;
