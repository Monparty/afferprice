"use client";
import UseTable from "@/app/components/utils/UseTable";
import { notifyError } from "@/app/providers/NotificationProvider";
import { getReportSummary, getRevenueByMonth } from "@/app/services/admin/reports.service";
import { useEffect, useState } from "react";

function Page() {
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalFee: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalBids: 0,
        soldCount: 0,
    });
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getReportSummary(), getRevenueByMonth()]).then(([s, m]) => {
            setSummary(s);
            if (m.error) notifyError(m.error);
            else setMonthly((m.data || []).map((r) => ({ ...r, key: r.month })));
            setLoading(false);
        });
    }, []);

    const columns = [
        { title: "เดือน", dataIndex: "month", key: "month" },
        {
            title: "ยอดขาย",
            dataIndex: "total",
            key: "total",
            sorter: (a, b) => a.total - b.total,
            render: (_, r) => <span className="font-bold">฿{Number(r.total).toLocaleString()}</span>,
        },
        {
            title: "ค่าธรรมเนียม 5%",
            dataIndex: "fee",
            key: "fee",
            render: (_, r) => <>฿{Number(r.total * 0.05).toLocaleString()}</>,
        },
    ];

    const cards = [
        { label: "รายได้รวม", value: `฿${summary.totalRevenue.toLocaleString()}` },
        { label: "ค่าธรรมเนียม 5%", value: `฿${summary.totalFee.toLocaleString()}` },
        { label: "ผู้ใช้งาน", value: summary.totalUsers.toLocaleString() },
        { label: "สินค้าทั้งหมด", value: summary.totalProducts.toLocaleString() },
        { label: "ขายแล้ว", value: summary.soldCount.toLocaleString() },
        { label: "การประมูล", value: summary.totalBids.toLocaleString() },
    ];

    return (
        <main className="grid gap-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cards.map((c) => (
                    <div key={c.label} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{c.label}</p>
                        <h3 className="text-xl font-bold mt-1">{c.value}</h3>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold">ยอดขายรายเดือน</h3>
                </div>
                <UseTable columns={columns} dataSource={monthly} loading={loading} />
            </div>
        </main>
    );
}

export default Page;
