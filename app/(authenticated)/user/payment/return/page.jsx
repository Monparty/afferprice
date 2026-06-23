"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";

// ปลายทางหลัง Omise redirect กลับ (TrueMoney / Rabbit LINE Pay)
// webhook charge.complete เป็นคนปิดงานจริง — หน้านี้แค่พาผู้ใช้ไปหน้าที่ refresh สถานะเอง
function ReturnContent() {
    const router = useRouter();
    const params = useSearchParams();
    const purpose = params.get("purpose");
    const productId = params.get("productId");

    useEffect(() => {
        const dest =
            purpose === "topup"
                ? "/user/wallet"
                : purpose === "listing_fee" && productId
                ? `/user/add-product/${productId}/edit`
                : "/user/selling";
        const t = setTimeout(() => router.replace(dest), 1500);
        return () => clearTimeout(t);
    }, [purpose, productId, router]);

    return (
        <main className="grid place-items-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-center">
                <LoadingOutlined className="text-4xl! text-orange-500!" spin />
                <p className="font-semibold">กำลังตรวจสอบสถานะการชำระเงิน...</p>
                <p className="text-sm text-gray-500">ระบบจะอัปเดตยอดให้อัตโนมัติเมื่อชำระเงินสำเร็จ</p>
            </div>
        </main>
    );
}

function Page() {
    return (
        <Suspense fallback={null}>
            <ReturnContent />
        </Suspense>
    );
}

export default Page;
