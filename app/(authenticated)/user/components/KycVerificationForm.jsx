"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ExclamationCircleFilled, SafetyCertificateFilled } from "@ant-design/icons";

import InputText from "@/app/components/inputs/InputText";
import UseSelect from "@/app/components/inputs/UseSelect";
import UseDatePicker from "@/app/components/inputs/UseDatePicker";
import UseTextArea from "@/app/components/inputs/UseTextArea";
import UseUpload from "@/app/components/inputs/UseUpload";
import UseCheckbox from "@/app/components/inputs/UseCheckbox";
import UseButton from "@/app/components/inputs/UseButton";
import UseTag from "@/app/components/utils/UseTag";

import { genderList, bankList } from "@/app/utils/dataSelect";
import { handleLocalPreview } from "@/app/utils/storageHelper";
import { validateImageFile, fileErrorMessage } from "@/app/utils/fileValidation";
import { getProfileById, updateProfileById } from "@/app/services/profile.service";
import { getCurrentUser } from "@/app/services/auth.service";
import { uploadIdCard, removeIdCard, createIdCardSignedUrl } from "@/app/services/upload.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { supabase } from "@/app/lib/supabase/client";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/app/features/user/userSlice";
import { kycFullSchema } from "./schema";

const KYC_TAG = {
    approved: { color: "green", label: "ยืนยันตัวตนแล้ว" },
    pending: { color: "orange", label: "รอการตรวจสอบ" },
    rejected: { color: "red", label: "ไม่ผ่านการตรวจสอบ" },
    unknown: { color: "default", label: "ยังไม่ได้ยืนยันตัวตน" },
};

function SectionHeading({ no, children }) {
    return (
        <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-5 bg-orange-500 rounded-full" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">
                {no}. {children}
            </h3>
        </div>
    );
}

function KycVerificationForm({ setIsOpenModalProfile, onKycSubmitted, onSubmitSaveProduct }) {
    const dispatch = useDispatch();
    const { handleSubmit, control, reset, setValue } = useForm({
        resolver: yupResolver(kycFullSchema),
        mode: "onBlur",
        defaultValues: { id_card_image: [], selfie_image: [], pdpa_consent: false, pdpa_accuracy: false },
    });
    const originalPathsRef = useRef({ idCard: null, selfie: null });
    const [kycStatus, setKycStatus] = useState("unknown");
    const [kycRemark, setKycRemark] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUserAndProfile();
    }, [reset]);

    const fetchUserAndProfile = async () => {
        const { data: currentUserData, error: userError } = await getCurrentUser();
        if (userError) return notifyError(userError);
        const userId = currentUserData.user?.id;
        const userEmail = currentUserData.user?.email;
        if (!userId) return;

        const { data: profile, error: profileError } = await getProfileById(userId);
        if (profileError) return notifyError(profileError);

        const p = profile ?? {};
        setKycStatus(p.is_kyc ?? "unknown");
        setKycRemark(p.kyc_remark ?? null);
        originalPathsRef.current = { idCard: p.id_card_image || null, selfie: p.selfie_image || null };

        const fullName = [p.first_name, p.last_name].filter(Boolean).join(" ");
        const formatData = {
            id: userId,
            email: userEmail,
            full_name: fullName,
            national_id: p.national_id ?? "",
            birth_date: p.birth_date ?? null,
            gender: p.gender ?? undefined,
            phone: p.phone ?? "",
            address: p.address ?? "",
            bank_name: p.bank_name ?? undefined,
            bank_account_no: p.bank_account_no ?? "",
            bank_account_name: p.bank_account_name ?? "",
            pdpa_consent: !!p.pdpa_consent_at,
            pdpa_accuracy: !!p.pdpa_consent_at,
            id_card_image: await signedFileList(p.id_card_image),
            selfie_image: await signedFileList(p.selfie_image),
        };
        reset(formatData);
    };

    const signedFileList = async (path) => {
        if (!path) return [];
        const { data: signed } = await createIdCardSignedUrl(path, 300);
        if (!signed?.signedUrl) return [];
        return [{ uid: path.split("/").pop(), url: signed.signedUrl, status: "done" }];
    };

    // อัปโหลดรูป PII ลง bucket id-cards (path = <uid>/<uuid>.<ext>); คืน path ใหม่/เดิม/null
    const uploadPrivateImage = async ({ userId, fileArr, originalPath }) => {
        const file = fileArr?.[0];
        if (file?.originFileObj) {
            const f = file.originFileObj;
            const err = await validateImageFile(f);
            if (err) throw new Error(fileErrorMessage(err));
            const { path, error } = await uploadIdCard({ userId, uid: file.uid, file: f });
            if (error) throw error;
            if (originalPath && originalPath !== path) await removeIdCard(originalPath);
            return path;
        }
        if (!file) {
            if (originalPath) await removeIdCard(originalPath);
            return null;
        }
        return originalPath;
    };

    const onSubmit = async (value) => {
        try {
            setSubmitting(true);
            const idCardPath = await uploadPrivateImage({
                userId: value.id,
                fileArr: value.id_card_image,
                originalPath: originalPathsRef.current.idCard,
            });
            const selfiePath = await uploadPrivateImage({
                userId: value.id,
                fileArr: value.selfie_image,
                originalPath: originalPathsRef.current.selfie,
            });

            const parts = value.full_name.trim().split(/\s+/);
            const firstName = parts.shift() || "";
            const lastName = parts.join(" ");

            const payload = {
                first_name: firstName,
                last_name: lastName,
                national_id: value.national_id,
                birth_date: value.birth_date ? value.birth_date.split(" ")[0] : null,
                gender: value.gender,
                phone: value.phone,
                address: value.address,
                id_card_image: idCardPath,
                selfie_image: selfiePath,
                bank_name: value.bank_name,
                bank_account_no: value.bank_account_no,
                bank_account_name: value.bank_account_name,
                pdpa_consent_at: new Date().toISOString(),
            };

            const { error } = await updateProfileById(value.id, payload);
            if (error) return notifyError(error);
            originalPathsRef.current = { idCard: idCardPath, selfie: selfiePath };

            const { error: rpcError } = await supabase.rpc("submit_kyc", { p_user_id: value.id });
            if (rpcError) return notifyError(rpcError);

            setKycStatus("pending");
            setKycRemark(null);
            dispatch(fetchUser());
            notifySuccess("ส่งข้อมูลยืนยันตัวตนสำเร็จ รอ admin ตรวจสอบ");
            onKycSubmitted?.();
            onSubmitSaveProduct?.();
            fetchUserAndProfile();
        } catch (err) {
            notifyError(err);
        } finally {
            setSubmitting(false);
        }
    };

    const tag = KYC_TAG[kycStatus] ?? KYC_TAG.unknown;
    const locked = kycStatus === "pending" || kycStatus === "approved";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">สถานะการยืนยันตัวตน:</span>
                <UseTag label={tag.label} color={tag.color} />
            </div>
            {kycStatus === "rejected" && kycRemark && (
                <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-300 dark:border-red-900 border-l-4">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
                        <ExclamationCircleFilled />
                        เหตุผลที่ไม่ผ่านการตรวจสอบ
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{kycRemark}</p>
                </div>
            )}

            {/* 1. ข้อมูลส่วนบุคคล */}
            <SectionHeading no={1}>ข้อมูลส่วนบุคคล</SectionHeading>
            <div className="flex gap-4 items-start">
                <InputText control={control} name="full_name" label="ชื่อ-นามสกุล (ตามบัตรประชาชน)" size="large" />
                <InputText
                    control={control}
                    name="national_id"
                    label="เลขประจำตัวประชาชน (13 หลัก)"
                    placeholder="ระบุเลข 13 หลัก"
                    size="large"
                />
            </div>
            <div className="flex gap-4 items-start">
                <UseDatePicker control={control} name="birth_date" label="วัน/เดือน/ปีเกิด" size="large" />
                <UseSelect
                    control={control}
                    name="gender"
                    label="เพศ"
                    size="large"
                    options={genderList}
                    placeholder="เลือกเพศ"
                />
            </div>

            {/* 2. ข้อมูลการติดต่อ */}
            <SectionHeading no={2}>ข้อมูลการติดต่อ</SectionHeading>
            <div className="flex gap-4 items-start">
                <InputText
                    control={control}
                    name="phone"
                    label="เบอร์โทรศัพท์มือถือ"
                    placeholder="08X-XXX-XXXX"
                    size="large"
                />
                <InputText control={control} name="email" label="อีเมล" size="large" disabled />
            </div>
            <UseTextArea
                control={control}
                name="address"
                label="ที่อยู่ปัจจุบัน (สำหรับจัดส่งเอกสาร/สินค้า)"
                size="large"
            />

            {/* 3. อัปโหลดเอกสารยืนยันตัวตน */}
            <SectionHeading no={3}>อัปโหลดเอกสารยืนยันตัวตน</SectionHeading>
            <div className="flex gap-4 items-start">
                <UseUpload
                    control={control}
                    name="id_card_image"
                    label="ภาพถ่ายหน้าบัตรประชาชน"
                    maxCount={1}
                    customRequest={(fileData) => handleLocalPreview({ fileData, name: "id_card_image", setValue })}
                />
                <UseUpload
                    control={control}
                    name="selfie_image"
                    label="ภาพเซลฟี่คู่กับบัตรประชาชน"
                    maxCount={1}
                    customRequest={(fileData) => handleLocalPreview({ fileData, name: "selfie_image", setValue })}
                />
            </div>

            {/* 4. ข้อมูลบัญชีธนาคาร */}
            <SectionHeading no={4}>ข้อมูลบัญชีธนาคาร (สำหรับรับเงินประมูล)</SectionHeading>
            <div className="flex gap-4 items-start">
                <UseSelect
                    control={control}
                    name="bank_name"
                    label="ธนาคาร"
                    size="large"
                    options={bankList}
                    placeholder="เลือกธนาคาร"
                />
                <InputText control={control} name="bank_account_no" label="เลขที่บัญชี" size="large" />
            </div>
            <InputText
                control={control}
                name="bank_account_name"
                label="ชื่อบัญชี (ต้องตรงกับชื่อที่สมัคร KYC)"
                size="large"
            />

            {/* 5. การให้ความยินยอม (PDPA) */}
            <SectionHeading no={5}>การให้ความยินยอม (PDPA)</SectionHeading>
            <UseCheckbox
                control={control}
                name="pdpa_consent"
                label="ข้าพเจ้ายินยอมให้ Afferprice เก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลและเอกสารยืนยันตัวตน เพื่อวัตถุประสงค์ในการตรวจสอบและยืนยันตัวตนตามกฎหมาย"
                className="text-xs! text-slate-600 dark:text-slate-300 items-start!"
            />
            <UseCheckbox
                control={control}
                name="pdpa_accuracy"
                label="ข้าพเจ้ายืนยันว่าข้อมูลและเอกสารทั้งหมดที่ให้เป็นความจริงทุกประการ หากตรวจพบว่ามีการปลอมแปลง ข้าพเจ้ายินดีรับผิดตามกฎหมายและกระบวนการที่เกี่ยวข้อง"
                className="text-xs! text-slate-600 dark:text-slate-300 items-start!"
            />

            <UseButton
                label="ยืนยันการส่งข้อมูล KYC"
                icon={SafetyCertificateFilled}
                htmlType="submit"
                wFull
                size="large"
                loading={submitting}
                disabled={locked}
            />
        </form>
    );
}

export default KycVerificationForm;
