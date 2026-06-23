"use client";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import UseModal from "@/app/components/utils/UseModal";
import UseButton from "@/app/components/inputs/UseButton";
import UseTag from "@/app/components/utils/UseTag";
import { approveKyc, getUserById, rejectKyc, getIdCardSignedUrlAdmin } from "@/app/services/admin/users.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import UseSkeleton from "@/app/components/utils/UseSkeleton";
import UseImage from "@/app/components/utils/UseImage";

const KYC_TAG = {
    approved: { color: "green", label: "ยืนยันแล้ว" },
    pending: { color: "orange", label: "รอตรวจสอบ" },
    rejected: { color: "red", label: "ไม่ผ่าน" },
    unknown: { color: "default", label: "ยังไม่ยืนยัน" },
};

function Detail({ label, value, full }) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap">{value || "-"}</p>
        </div>
    );
}

function KycReviewModal({ open, userId, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [idCardUrl, setIdCardUrl] = useState(null);
    const [selfieUrl, setSelfieUrl] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [remark, setRemark] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            setUser(null);
            setIdCardUrl(null);
            setSelfieUrl(null);
            setShowRejectModal(false);
            setRemark("");
            setSubmitting(false);
            setLoading(false);
            return;
        }
        if (!userId) return;
        setLoading(true);
        setUser(null);
        setIdCardUrl(null);
        setSelfieUrl(null);
        (async () => {
            const { data, error } = await getUserById(userId);
            if (error) {
                notifyError(error);
                setLoading(false);
                return;
            }
            setUser(data);
            if (data?.id_card_image) {
                const { data: signed } = await getIdCardSignedUrlAdmin(data.id_card_image, 300);
                if (signed?.signedUrl) setIdCardUrl(signed.signedUrl);
            }
            if (data?.selfie_image) {
                const { data: signed } = await getIdCardSignedUrlAdmin(data.selfie_image, 300);
                if (signed?.signedUrl) setSelfieUrl(signed.signedUrl);
            }
            setLoading(false);
        })();
    }, [open, userId]);

    const handleApprove = async () => {
        setSubmitting(true);
        const { error } = await approveKyc(userId);
        setSubmitting(false);
        if (error) return notifyError(error);
        notifySuccess("อนุมัติ KYC สำเร็จ");
        onSuccess?.();
        onClose?.();
    };

    const handleConfirmReject = async () => {
        if (!remark.trim()) return notifyError(new Error("กรุณาระบุเหตุผล"));
        setSubmitting(true);
        const { error } = await rejectKyc(userId, remark.trim());
        setSubmitting(false);
        if (error) return notifyError(error);
        notifySuccess("ปฏิเสธ KYC สำเร็จ");
        setShowRejectModal(false);
        setRemark("");
        onSuccess?.();
        onClose?.();
    };

    const status = user?.is_kyc ?? "unknown";
    const tag = KYC_TAG[status] ?? KYC_TAG.unknown;
    const isPending = status === "pending";

    return (
        <>
            <UseModal open={open} onCancel={onClose} isShowCancel={false} title="ตรวจสอบเอกสาร KYC">
                {loading || !user ? (
                    <div className="grid gap-6">
                        <UseSkeleton />
                        <UseSkeleton />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <div className="grid gap-1">
                            <p className="text-sm text-slate-500 dark:text-slate-400">ผู้ใช้</p>
                            <p className="font-semibold">
                                {user.first_name || "-"} {user.last_name || ""}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500 dark:text-slate-400">สถานะ:</span>
                            <UseTag label={tag.label} color={tag.color} />
                        </div>
                        {status === "rejected" && user.kyc_remark && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-red-700 mb-1">เหตุผลครั้งล่าสุด</p>
                                <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{user.kyc_remark}</p>
                            </div>
                        )}
                        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 dark:bg-slate-700/40 rounded-lg p-3">
                            <Detail label="เลขประจำตัวประชาชน" value={user.national_id} />
                            <Detail label="เบอร์โทรศัพท์" value={user.phone} />
                            <Detail label="ที่อยู่ปัจจุบัน" value={user.address} full />
                            <Detail label="ธนาคาร" value={user.bank_name} />
                            <Detail label="เลขที่บัญชี" value={user.bank_account_no} />
                            <Detail label="ชื่อบัญชี" value={user.bank_account_name} full />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 items-start">
                            <div className="grid gap-2">
                                <p className="text-sm font-semibold">ภาพถ่ายหน้าบัตรประชาชน</p>
                                {idCardUrl ? (
                                    <UseImage
                                        src={idCardUrl}
                                        alt="id card"
                                        className="w-full max-h-64 object-contain"
                                    />
                                ) : (
                                    <p className="text-sm text-slate-400">ยังไม่ได้อัปโหลด</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <p className="text-sm font-semibold">ภาพเซลฟี่คู่กับบัตรประชาชน</p>
                                {selfieUrl ? (
                                    <UseImage
                                        src={selfieUrl}
                                        alt="selfie"
                                        className="w-full max-h-64 object-contain"
                                    />
                                ) : (
                                    <p className="text-sm text-slate-400">ยังไม่ได้อัปโหลด</p>
                                )}
                            </div>
                        </div>
                        {isPending && (
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                <UseButton type="default" label="ปิด" onClick={() => onClose?.()} />
                                <UseButton
                                    label="ไม่อนุมัติ"
                                    icon={CloseCircleFilled}
                                    className="bg-red-500! text-white!"
                                    type="default"
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={submitting}
                                />
                                <UseButton
                                    label="อนุมัติ"
                                    icon={CheckCircleFilled}
                                    className="bg-green-500! text-white!"
                                    onClick={handleApprove}
                                    loading={submitting}
                                />
                            </div>
                        )}
                    </div>
                )}
            </UseModal>

            <UseModal
                open={showRejectModal}
                onCancel={() => {
                    setShowRejectModal(false);
                    setRemark("");
                }}
                onOk={handleConfirmReject}
                title="เหตุผลที่ไม่อนุมัติ"
                okText="ยืนยันไม่อนุมัติ"
            >
                <div className="grid gap-2">
                    <label className="text-sm text-slate-600 dark:text-slate-300">ระบุเหตุผลให้ผู้ใช้ทราบ</label>
                    <Input.TextArea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        placeholder="เช่น รูปสำเนาบัตรประชาชนไม่ชัดเจน กรุณาอัปโหลดใหม่"
                    />
                </div>
            </UseModal>
        </>
    );
}

export default KycReviewModal;
