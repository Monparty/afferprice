"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getWalletBalances, getWalletTransactions } from "@/app/services/admin/wallet.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { useEffect, useState } from "react";

const TYPE_COLOR = {
    topup: "green",
    payment: "blue",
    refund: "gold",
    sale: "cyan",
    withdrawal: "volcano",
};

function Page() {
    const [balances, setBalances] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getWalletBalances(), getWalletTransactions()]).then(([bRes, tRes]) => {
            if (bRes.error) notifyError(bRes.error);
            else
                setBalances(
                    (bRes.data || []).map((b) => ({
                        ...b,
                        key: b.id,
                        fullName: [b.first_name, b.last_name].filter(Boolean).join(" ") || "-",
                    })),
                );
            if (tRes.error) notifyError(tRes.error);
            else
                setTransactions(
                    (tRes.data || []).map((t) => ({
                        ...t,
                        key: t.id,
                        userName: [t.user?.first_name, t.user?.last_name].filter(Boolean).join(" ") || "-",
                        createdAt: formatDateTime(t.created_at),
                    })),
                );
            setLoading(false);
        });
    }, []);

    const totalLiability = balances.reduce((sum, b) => sum + Number(b.wallet_balance || 0), 0);

    const balanceColumns = [
        { title: "ผู้ใช้", dataIndex: "fullName", key: "fullName" },
        {
            title: "ยอดคงเหลือ",
            dataIndex: "wallet_balance",
            key: "wallet_balance",
            sorter: (a, b) => a.wallet_balance - b.wallet_balance,
            render: (_, r) => <span className="font-bold">฿{Number(r.wallet_balance || 0).toLocaleString()}</span>,
        },
    ];

    const txColumns = [
        { title: "ผู้ใช้", dataIndex: "userName", key: "userName" },
        {
            title: "ประเภท",
            dataIndex: "type",
            key: "type",
            render: (_, r) => (
                <UseTag label={r.type} variant="filled" color={TYPE_COLOR[r.type] || "default"} className="capitalize" />
            ),
        },
        {
            title: "จำนวน",
            dataIndex: "amount",
            key: "amount",
            sorter: (a, b) => a.amount - b.amount,
            render: (_, r) => (
                <span className={r.amount >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {r.amount >= 0 ? "+" : ""}฿{Number(r.amount).toLocaleString()}
                </span>
            ),
        },
        {
            title: "คงเหลือ",
            dataIndex: "balance_after",
            key: "balance_after",
            render: (_, r) => <>฿{Number(r.balance_after).toLocaleString()}</>,
        },
        { title: "หมายเหตุ", dataIndex: "note", key: "note" },
        {
            title: "วันที่",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            defaultSortOrder: "descend",
        },
    ];

    return (
        <main className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">ยอดเงินรวมในระบบ</p>
                    <h3 className="text-2xl font-bold mt-2">฿{totalLiability.toLocaleString()}</h3>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">จำนวนผู้ใช้ที่มียอด</p>
                    <h3 className="text-2xl font-bold mt-2">
                        {balances.filter((b) => Number(b.wallet_balance || 0) > 0).length}
                    </h3>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">รายการล่าสุด</p>
                    <h3 className="text-2xl font-bold mt-2">{transactions.length}</h3>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold">ยอดคงเหลือรายผู้ใช้</h3>
                </div>
                <UseTable columns={balanceColumns} dataSource={balances} loading={loading} />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold">รายการธุรกรรม</h3>
                </div>
                <UseTable columns={txColumns} dataSource={transactions} loading={loading} />
            </div>
        </main>
    );
}

export default Page;
