"use client";

import { CreditCardFilled } from "@ant-design/icons";
import PaymentMethodCard from "./PaymentMethodCard";
import OmiseCardForm from "./OmiseCardForm";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { apiPost } from "@/app/lib/api";

function CreditCardListingBtn({ productId, amount, onSuccess }) {
    const handleToken = async (token) => {
        try {
            const data = await apiPost("/api/payment/credit-card", { omiseToken: token, purpose: "listing_fee", productId });
            notifySuccess("ส่งคำสั่งชำระเงินแล้ว กำลังตรวจสอบสถานะ");
            onSuccess?.(data);
        } catch (err) {
            notifyError(err);
        }
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
