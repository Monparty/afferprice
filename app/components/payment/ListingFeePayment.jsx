"use client";

import PromptPayListingBtn from "./PromptPayListingBtn";
import WalletListingBtn from "./WalletListingBtn";

function ListingFeePayment({ amount, productId, onSuccess }) {
    return (
        <div className="grid gap-3">
            <PromptPayListingBtn productId={productId} amount={amount} />
            <WalletListingBtn productId={productId} amount={amount} onSuccess={onSuccess} />
        </div>
    );
}

export default ListingFeePayment;
