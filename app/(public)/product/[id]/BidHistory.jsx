"use client";
import { useState } from "react";
import UseButton from "@/app/components/inputs/UseButton";
import UseModal from "@/app/components/utils/UseModal";

function formatTimeAgo(time) {
    const mins = Math.floor((Date.now() - new Date(time)) / 60000);
    if (mins < 1) return "เมื่อสักครู่";
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
    return `${Math.floor(hrs / 24)} วันที่แล้ว`;
}

function BidRow({ bid, index, currentUserId }) {
    const isMe = bid.user_id === currentUserId;
    const initials = isMe ? "ME" : bid.user_id.slice(0, 2).toUpperCase();
    const maskedId = isMe ? "คุณ" : `u***${bid.user_id.slice(-4)}`;
    const isLeader = index === 0;
    return (
        <div
            className={`flex items-center justify-between py-2 border-b border-slate-100 dark:border-zinc-800 ${
                isMe ? "bg-blue-50 dark:bg-blue-950/40 -mx-2 px-2 rounded-md border-blue-100 dark:border-blue-900" : ""
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`size-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isMe ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-slate-300"
                    }`}
                >
                    {initials}
                </div>
                <div>
                    <div className="flex items-center gap-1">
                        <p className={`text-sm font-bold ${isMe ? "text-blue-600 dark:text-blue-400" : ""}`}>{maskedId}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase">{formatTimeAgo(bid.bid_time)}</p>
                </div>
            </div>
            <div className="text-right">
                <p className={`text-sm font-extrabold ${isLeader ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    ฿{Number(bid.bid_price).toLocaleString("th-TH")}
                </p>
                <p className={`text-[10px] font-medium ${isLeader ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    {isLeader ? "ผู้นำประมูล" : "ถูกประมูลแซง"}
                </p>
            </div>
        </div>
    );
}

export default function BidHistory({ bids, currentUserId }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200 dark:border-zinc-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> ประวัติการประมูล
                </h3>
                <span className="text-xs text-slate-400">{bids.length} รายการ</span>
            </div>
            <div className="space-y-3">
                {bids.slice(0, 5).map((bid, i) => (
                    <BidRow key={bid.id} bid={bid} index={i} currentUserId={currentUserId} />
                ))}
                {bids.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-4">ยังไม่มีการประมูล</p>
                )}
            </div>
            {bids.length > 5 && (
                <div className="flex justify-center">
                    <UseButton
                        label={`ดูประวัติทั้งหมด ${bids.length} รายการ`}
                        type="text"
                        className="text-xs! font-bold! text-slate-400!"
                        onClick={() => setOpen(true)}
                    />
                </div>
            )}
            <UseModal
                title="ประวัติการประมูลทั้งหมด"
                open={open}
                onCancel={() => setOpen(false)}
                cancelText="ปิด"
            >
                <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
                    {bids.map((bid, i) => (
                        <BidRow key={bid.id} bid={bid} index={i} currentUserId={currentUserId} />
                    ))}
                </div>
            </UseModal>
        </div>
    );
}
