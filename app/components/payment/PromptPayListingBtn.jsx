"use client";

import { QrcodeOutlined } from "@ant-design/icons";
import PaymentMethodCard from "./PaymentMethodCard";
import PromptPayQR from "./PromptPayQR";

function PromptPayListingBtn({ productId, amount }) {
    return (
        <PaymentMethodCard icon={QrcodeOutlined} title="ชำระด้วย PromptPay" subtitle="สแกน QR ผ่านแอปธนาคาร">
            <PromptPayQR
                amount={amount}
                purpose="listing_fee"
                productId={productId}
                label={`ชำระด้วย PromptPay (฿${amount.toLocaleString()})`}
                wFull
            />
        </PaymentMethodCard>
    );
}

export default PromptPayListingBtn;
