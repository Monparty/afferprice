"use client";

import { CreditCardFilled } from "@ant-design/icons";
import PaymentMethodCard from "./PaymentMethodCard";
import OmiseCardForm from "./OmiseCardForm";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";

function CreditCardListingBtn({ productId, amount, onSuccess }) {
    const handleToken = async (token) => {
        const res = await fetch("/api/payment/credit-card", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ omiseToken: token, purpose: "listing_fee", productId }),
        });
        const data = await res.json();
        if (!res.ok) {
            notifyError(new Error(data?.error || "ชำระเงินไม่สำเร็จ"));
            return;
        }
        notifySuccess("ส่งคำสั่งชำระเงินแล้ว กำลังตรวจสอบสถานะ");
        onSuccess?.(data);
    };

    return (
        <PaymentMethodCard icon={CreditCardFilled} title="บัตรเครดิต/เดบิต" subtitle="Visa / Mastercard / JCB">
            <OmiseCardForm
                amount={amount}
                onToken={handleToken}
                submitLabel={`ชำระด้วยบัตร (฿${Number(amount).toLocaleString()})`}
            />
        </PaymentMethodCard>
    );
}

export default CreditCardListingBtn;
