"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Spin, Result } from "antd";
import { getAuctionResult } from "@/app/services/payment.service";
import PromptPayQR from "@/app/components/payment/PromptPayQR";

function Page() {
    const { id } = useParams();
    const user = useSelector((state) => state.user.data);
    const [auctionResult, setAuctionResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data, error } = await getAuctionResult(id);
            if (!error) setAuctionResult(data);
            setLoading(false);
        };
        fetch();
    }, [id]);

    if (loading) return <Spin className="flex justify-center mt-20" />;
    if (!auctionResult) return <Result status="404" title="ไม่พบข้อมูลการประมูล" />;

    return (
        <div className="flex flex-col items-center gap-6 py-10">
            <div className="text-center">
                <h1 className="text-2xl font-bold">{auctionResult.products?.title}</h1>
                <p className="text-slate-500 mt-1">ราคาที่ชนะการประมูล</p>
                <p className="text-3xl font-bold text-orange-500 mt-2">
                    ฿{Number(auctionResult.final_price).toLocaleString()}
                </p>
            </div>

            <PromptPayQR
                auctionResultId={id}
                userId={user?.id}
                amount={Number(auctionResult.final_price)}
            />
        </div>
    );
}

export default Page;
