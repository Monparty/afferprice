"use client";

import Script from "next/script";

function PaymentBtn() {
    const handleLoad = () => {
        const OmiseCard = window.OmiseCard;

        OmiseCard.configure({
            publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY,
            currency: "THB",
            amount: 100000, // 1000 บาท = 100000 satang
        });

        OmiseCard.configureButton("#checkout-button");
        OmiseCard.attach();
    };
    return (
        <>
            <button id="checkout-button" className="border p-2">
                Pay
            </button>
            <Script src="https://cdn.omise.co/omise.js" strategy="afterInteractive" onLoad={handleLoad} />
        </>
    );
}

export default PaymentBtn;
