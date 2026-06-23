"use client";

import PromptPayListingBtn from "./PromptPayListingBtn";
import WalletListingBtn from "./WalletListingBtn";
import CreditCardListingBtn from "./CreditCardListingBtn";
import TrueMoneyListingBtn from "./TrueMoneyListingBtn";
import RabbitLinePayListingBtn from "./RabbitLinePayListingBtn";

function ListingFeePayment({ amount, productId, onSuccess }) {
    return (
        <div className="grid gap-3">
            <PromptPayListingBtn productId={productId} amount={amount} />
            <WalletListingBtn productId={productId} amount={amount} onSuccess={onSuccess} />
            <CreditCardListingBtn productId={productId} amount={amount} onSuccess={onSuccess} />
            <TrueMoneyListingBtn productId={productId} amount={amount} />
            <RabbitLinePayListingBtn productId={productId} amount={amount} />
        </div>
    );
}

export default ListingFeePayment;
