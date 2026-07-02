"use client";

import { useState } from "react";
import { QrcodeOutlined, WalletFilled, CreditCardFilled, MobileOutlined, MessageFilled } from "@ant-design/icons";
import PromptPayListingBtn from "./PromptPayListingBtn";
import WalletListingBtn from "./WalletListingBtn";
import CreditCardListingBtn from "./CreditCardListingBtn";
import TrueMoneyListingBtn from "./TrueMoneyListingBtn";
import RabbitLinePayListingBtn from "./RabbitLinePayListingBtn";

const METHODS = [
    { key: "promptpay", label: "PromptPay", icon: QrcodeOutlined },
    { key: "wallet", label: "Wallet", icon: WalletFilled },
    { key: "credit_card", label: "บัตรเครดิต/เดบิต", icon: CreditCardFilled },
    { key: "truemoney", label: "TrueMoney", icon: MobileOutlined },
    { key: "linepay", label: "Rabbit LINE Pay", icon: MessageFilled },
];

function ListingFeePayment({ amount, productId, onSuccess }) {
    const [method, setMethod] = useState("promptpay");

    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {METHODS.map(({ key, label, icon: Icon }) => {
                    const active = method === key;
                    return (
                        <div
                            key={key}
                            onClick={() => setMethod(key)}
                            className={`flex items-center gap-2 cursor-pointer rounded-xl border p-3 transition-colors ${
                                active
                                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                                    : "border-slate-200 dark:border-zinc-700 hover:border-orange-300"
                            }`}
                        >
                            <Icon className={active ? "text-orange-500!" : "text-slate-400!"} />
                            <span className={`text-sm ${active ? "font-semibold text-orange-600 dark:text-orange-400" : ""}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {method === "promptpay" && <PromptPayListingBtn productId={productId} amount={amount} />}
            {method === "wallet" && <WalletListingBtn productId={productId} amount={amount} onSuccess={onSuccess} />}
            {method === "credit_card" && <CreditCardListingBtn productId={productId} amount={amount} onSuccess={onSuccess} />}
            {method === "truemoney" && <TrueMoneyListingBtn productId={productId} amount={amount} />}
            {method === "linepay" && <RabbitLinePayListingBtn productId={productId} amount={amount} />}
        </div>
    );
}

export default ListingFeePayment;
