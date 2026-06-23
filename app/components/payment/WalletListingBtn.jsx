"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { WalletFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import UseButton from "../inputs/UseButton";
import PaymentMethodCard from "./PaymentMethodCard";
import { getMyWalletBalance, subscribeWallet } from "@/app/services/wallet.service";
import { setWalletBalance as setWalletBalanceAction } from "@/app/features/user/userSlice";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { supabase } from "@/app/lib/supabase/client";

function WalletListingBtn({ productId, amount, onSuccess }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [paid, setPaid] = useState(false);

    const refreshBalance = async () => {
        const { data } = await getMyWalletBalance();
        if (data) setBalance(Number(data.wallet_balance) || 0);
    };

    useEffect(() => {
        let mounted = true;
        let cleanup;
        refreshBalance();
        (async () => {
            const { data: { user } = {} } = await supabase.auth.getUser();
            if (!mounted || !user) return;
            cleanup = subscribeWallet(user.id, refreshBalance);
        })();
        return () => {
            mounted = false;
            cleanup?.();
        };
    }, []);

    const handlePay = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/payment/wallet/listing-fee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            const data = await res.json();
            if (!res.ok) {
                notifyError(new Error(data?.error || "ชำระเงินไม่สำเร็จ"));
                return;
            }
            if (typeof data?.balance_after === "number") {
                dispatch(setWalletBalanceAction(data.balance_after));
                setBalance(data.balance_after);
            }
            setPaid(true);
            notifySuccess("ชำระค่าธรรมเนียมสำเร็จ");
            onSuccess?.(data);
        } catch (err) {
            notifyError(err);
        } finally {
            setSubmitting(false);
        }
    };

    const insufficient = balance < amount;

    if (paid) {
        return (
            <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-xl p-4 text-center">
                <p className="text-green-700 dark:text-green-400 font-semibold">ชำระค่าธรรมเนียมสำเร็จ</p>
            </div>
        );
    }

    return (
        <PaymentMethodCard
            icon={WalletFilled}
            title="ชำระด้วย Wallet"
            subtitle={`ยอดคงเหลือ ฿${balance.toLocaleString()}`}
        >
            {insufficient && (
                <p className="text-xs text-red-500 mb-2">ยอดคงเหลือไม่เพียงพอ กรุณาเติมเงินก่อน</p>
            )}
            <UseButton
                label={insufficient ? "เติมเงินเข้า Wallet" : `ชำระด้วย Wallet (฿${amount.toLocaleString()})`}
                onClick={insufficient ? () => router.push("/user/wallet") : handlePay}
                loading={submitting}
                disabled={submitting || !productId || !amount}
                wFull
            />
        </PaymentMethodCard>
    );
}

export default WalletListingBtn;
