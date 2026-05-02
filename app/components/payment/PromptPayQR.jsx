"use client";

import { useState } from "react";
import { Button, Modal, Spin } from "antd";

function PromptPayQR({ auctionResultId, userId, amount }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState(null);

    const handleOpen = async () => {
        setOpen(true);
        setLoading(true);
        const res = await fetch("/api/payment/promptpay", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ auctionResultId, userId, amount }),
        });
        const data = await res.json();
        setQrData(data);
        setLoading(false);
    };

    return (
        <>
            <Button type="primary" onClick={handleOpen}>
                ชำระด้วย PromptPay
            </Button>

            <Modal
                title="สแกน QR Code เพื่อชำระเงิน"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
            >
                {loading && <Spin className="flex justify-center py-8" />}
                {qrData?.qrCodeUrl && (
                    <div className="flex flex-col items-center gap-3">
                        <p className="text-lg font-semibold">฿{amount.toLocaleString()}</p>
                        <img src={qrData.qrCodeUrl} alt="PromptPay QR" className="w-64 h-64" />
                        <p className="text-sm text-gray-500">
                            QR หมดอายุ: {new Date(qrData.expiresAt).toLocaleString("th-TH")}
                        </p>
                    </div>
                )}
            </Modal>
        </>
    );
}

export default PromptPayQR;
