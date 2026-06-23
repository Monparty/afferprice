"use client";

import { useState } from "react";
import Script from "next/script";
import UseButton from "../inputs/UseButton";
import { notifyError } from "@/app/providers/NotificationProvider";

const inputCls =
    "w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400";

// ฟอร์มบัตรเครดิต/เดบิต — tokenize ฝั่ง client ผ่าน Omise.js (PAN ไม่ส่งเข้า server)
// onToken(token) รับ token แล้วให้ parent ยิงไป /api/payment/credit-card เอง (parent คุม purpose/ids)
function OmiseCardForm({ amount, onToken, submitLabel }) {
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (typeof window === "undefined" || !window.Omise) {
            return notifyError("ระบบบัตรเครดิตยังไม่พร้อม กรุณาลองใหม่อีกครั้ง");
        }
        const [mm, yy] = expiry.split("/").map((s) => s.trim());
        if (!number || !mm || !yy || !cvc) return notifyError("กรุณากรอกข้อมูลบัตรให้ครบถ้วน");

        setSubmitting(true);
        try {
            window.Omise.setPublicKey(process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY);
            const token = await new Promise((resolve, reject) => {
                window.Omise.createToken(
                    "card",
                    {
                        name: name || "Card Holder",
                        number: number.replace(/\s/g, ""),
                        expiration_month: mm,
                        expiration_year: yy.length === 2 ? `20${yy}` : yy,
                        security_code: cvc,
                    },
                    (statusCode, response) => {
                        if (response.object === "error" || statusCode !== 200) {
                            reject(new Error(response.message || "บัตรไม่ถูกต้อง"));
                        } else {
                            resolve(response.id);
                        }
                    }
                );
            });
            await onToken(token);
        } catch (err) {
            notifyError(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="grid gap-3">
            <Script src="https://cdn.omise.co/omise.js" strategy="afterInteractive" />
            <input
                className={inputCls}
                placeholder="หมายเลขบัตร"
                inputMode="numeric"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
            />
            <input
                className={inputCls}
                placeholder="ชื่อบนบัตร"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
                <input
                    className={inputCls}
                    placeholder="เดือน/ปี (MM/YY)"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                />
                <input
                    className={inputCls}
                    placeholder="CVC"
                    inputMode="numeric"
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                />
            </div>
            <UseButton
                label={submitLabel || `ชำระด้วยบัตร (฿${Number(amount || 0).toLocaleString()})`}
                onClick={handleSubmit}
                loading={submitting}
                disabled={submitting || !amount}
                wFull
            />
        </div>
    );
}

export default OmiseCardForm;
