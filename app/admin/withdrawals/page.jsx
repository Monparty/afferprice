"use client";
import UseTable from "@/app/components/utils/UseTable";
import UseTag from "@/app/components/utils/UseTag";
import UseButton from "@/app/components/inputs/UseButton";
import UseModal from "@/app/components/utils/UseModal";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { getWithdrawals, processWithdrawal } from "@/app/services/admin/withdrawals.service";
import { formatDateTime } from "@/app/utils/dateUtils";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useState } from "react";

const STATUS_COLOR = { pending: "gold", paid: "green", rejected: "red" };
const STATUS_LABEL = { pending: "รอดำเนินการ", paid: "จ่ายแล้ว", rejected: "ปฏิเสธ" };

function Page() {
    const [dataSource, setDataSource] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rejectNote, setRejectNote] = useState("");

    const load = () => {
        getWithdrawals().then(({ data, error }) => {
            if (error) return notifyError(error);
            setDataSource(
                (data ?? []).map((w) => ({
                    ...w,
                    key: w.id,
                    userName: [w.user?.first_name, w.user?.last_name].filter(Boolean).join(" ") || "-",
                    email: w.user?.email || "-",
                    createdAt: formatDateTime(w.created_at),
                })),
            );
        });
    };

    useEffect(() => {
        load();
    }, []);

    const handleApprove = async (id) => {
        setSubmitting(true);
        const { error } = await processWithdrawal(id, "paid");
        setSubmitting(false);
        if (error) return notifyError(error);
        notifySuccess("อนุมัติการถอนเงินแล้ว");
        load();
    };

    const handleReject = async () => {
        if (!rejectTarget) return;
        setSubmitting(true);
        const { error } = await processWithdrawal(rejectTarget.id, "rejected", rejectNote.trim() || null);
        setSubmitting(false);
        if (error) return notifyError(error);
        notifySuccess("ปฏิเสธคำขอและคืนเงินแล้ว");
        setRejectTarget(null);
        setRejectNote("");
        load();
    };

    const columns = [
        { title: "ผู้ขอถอน", dataIndex: "userName", key: "userName" },
        { title: "อีเมล", dataIndex: "email", key: "email" },
        {
            title: "จำนวนเงิน",
            dataIndex: "amount",
            key: "amount",
            sorter: (a, b) => a.amount - b.amount,
            render: (_, r) => <span className="font-bold">฿{Number(r.amount)?.toLocaleString()}</span>,
        },
        {
            title: "บัญชีธนาคาร",
            key: "bank",
            render: (_, r) => (
                <div className="text-xs">
                    <div className="font-semibold">{r.bank_name || "-"}</div>
                    <div>{r.bank_account_no || "-"}</div>
                    <div className="text-slate-400">{r.bank_account_name || ""}</div>
                </div>
            ),
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            render: (_, r) => <UseTag label={STATUS_LABEL[r.status] || r.status} variant="filled" color={STATUS_COLOR[r.status] || "default"} />,
        },
        {
            title: "วันที่ขอ",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            defaultSortOrder: "descend",
        },
        {
            title: "จัดการ",
            key: "action",
            render: (_, r) =>
                r.status === "pending" ? (
                    <div className="flex gap-2">
                        <UseButton
                            label="จ่ายแล้ว"
                            icon={CheckOutlined}
                            className="bg-green-600! border-green-600!"
                            onClick={() => handleApprove(r.id)}
                            disabled={submitting}
                        />
                        <UseButton
                            label="ปฏิเสธ"
                            icon={CloseOutlined}
                            danger
                            type="default"
                            onClick={() => setRejectTarget(r)}
                            disabled={submitting}
                        />
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">{r.admin_note || "—"}</span>
                ),
        },
    ];

    return (
        <main className="grid gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
            <UseModal
                title="ปฏิเสธคำขอถอนเงิน"
                open={!!rejectTarget}
                onOk={handleReject}
                onCancel={() => {
                    setRejectTarget(null);
                    setRejectNote("");
                }}
                okText="ยืนยันปฏิเสธ (คืนเงิน)"
            >
                <div className="grid gap-2">
                    <p className="text-sm text-slate-500">
                        ยอด ฿{Number(rejectTarget?.amount || 0).toLocaleString()} จะถูกคืนเข้ากระเป๋าเงินของผู้ใช้ ระบุเหตุผล (ถ้ามี):
                    </p>
                    <Input.TextArea
                        rows={3}
                        value={rejectNote}
                        onChange={(e) => setRejectNote(e.target.value)}
                        placeholder="เช่น ข้อมูลบัญชีไม่ถูกต้อง"
                    />
                </div>
            </UseModal>
        </main>
    );
}

export default Page;
