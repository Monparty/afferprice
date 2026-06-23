"use client";

import { useState } from "react";
import { MobileOutlined } from "@ant-design/icons";
import PaymentMethodCard from "./PaymentMethodCard";
import UseButton from "../inputs/UseButton";
import { startOmiseRedirect } from "./redirectPay";
import { notifyError } from "@/app/providers/NotificationProvider";

function TrueMoneyListingBtn({ productId, amount }) {
    const [phone, setPhone] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handlePay = async () => {
        if (!/^0\d{9}$/.test(phone)) return notifyError("กรุณากรอกเบอร์ที่ผูกกับ TrueMoney (10 หลัก)");
        setSubmitting(true);
        try {
            // redirect ออกไป Omise → ไม่ต้อง reset submitting ในเคสสำเร็จ
            await startOmiseRedirect({ sourceType: "truemoney", purpose: "listing_fee", productId, phoneNumber: phone });
        } catch (err) {
            notifyError(err);
            setSubmitting(false);
        }
    };

    return (
        <PaymentMethodCard icon={MobileOutlined} title="TrueMoney Wallet" subtitle="ยืนยันการชำระผ่านแอป TrueMoney">
            <input
                className="w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-orange-400"
                placeholder="เบอร์โทร TrueMoney (เช่น 0812345678)"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <UseButton
                label={`ชำระด้วย TrueMoney (฿${Number(amount).toLocaleString()})`}
                onClick={handlePay}
                loading={submitting}
                disabled={submitting || !productId || !amount}
                wFull
            />
        </PaymentMethodCard>
    );
}

export default TrueMoneyListingBtn;
