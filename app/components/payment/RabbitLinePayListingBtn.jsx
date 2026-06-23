"use client";

import { useState } from "react";
import { MessageFilled } from "@ant-design/icons";
import PaymentMethodCard from "./PaymentMethodCard";
import UseButton from "../inputs/UseButton";
import { startOmiseRedirect } from "./redirectPay";
import { notifyError } from "@/app/providers/NotificationProvider";

function RabbitLinePayListingBtn({ productId, amount }) {
    const [submitting, setSubmitting] = useState(false);

    const handlePay = async () => {
        setSubmitting(true);
        try {
            await startOmiseRedirect({ sourceType: "rabbit_linepay", purpose: "listing_fee", productId });
        } catch (err) {
            notifyError(err);
            setSubmitting(false);
        }
    };

    return (
        <PaymentMethodCard icon={MessageFilled} title="Rabbit LINE Pay" subtitle="ยืนยันการชำระผ่านแอป LINE">
            <UseButton
                label={`ชำระด้วย LINE Pay (฿${Number(amount).toLocaleString()})`}
                onClick={handlePay}
                loading={submitting}
                disabled={submitting || !productId || !amount}
                wFull
            />
        </PaymentMethodCard>
    );
}

export default RabbitLinePayListingBtn;
