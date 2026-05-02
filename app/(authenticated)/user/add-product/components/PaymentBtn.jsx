"use client";

import PromptPayQR from "@/app/components/payment/PromptPayQR";
import { useSelector } from "react-redux";

const LISTING_FEE = 30;

function PaymentBtn() {
    const user = useSelector((state) => state.user.data);

    return <PromptPayQR userId={user?.id} amount={LISTING_FEE} />;
}

export default PaymentBtn;
