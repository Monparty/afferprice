"use client";
import InputText from "@/app/components/inputs/InputText";
import UseInputPassword from "@/app/components/inputs/UseInputPassword";
import UseSelect from "@/app/components/inputs/UseSelect";
import { genderList, birthDayList, birthMonthList, birthYearList } from "../../../utils/dataSelect";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { getProfileById, updateProfileById } from "@/app/services/profile.service";
import { getCurrentUser, updatePassword } from "@/app/services/auth.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import UseUpload from "@/app/components/inputs/UseUpload";
import UseButton from "@/app/components/inputs/UseButton";
import UseTag from "@/app/components/utils/UseTag";
import { handleLocalPreview, removeDeletedFiles, uploadPendingFiles } from "@/app/utils/storageHelper";
import { uploadIdCard, removeIdCard, createIdCardSignedUrl } from "@/app/services/upload.service";
import { validateImageFile, fileErrorMessage } from "@/app/utils/fileValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, kycSchema } from "./schema";
import { supabase } from "@/app/lib/supabase/client";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/app/features/user/userSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";

const KYC_TAG = {
    approved: { color: "green", label: "ยืนยันตัวตนแล้ว" },
    pending: { color: "orange", label: "รอการตรวจสอบ" },
    rejected: { color: "red", label: "ไม่ผ่านการตรวจสอบ" },
    unknown: { color: "default", label: "ยังไม่ได้ยืนยันตัวตน" },
};

function UserProfilesForm({ setIsOpenModalProfile, kycMode = false, onKycSubmitted, onSubmitSaveProduct }) {
    const dispatch = useDispatch();
    const { handleSubmit, control, reset, setValue, getValues } = useForm({
        resolver: yupResolver(kycMode ? kycSchema : schema),
        mode: "onBlur",
    });
    const originalFilesRef = useRef({ profile: [], idCard: [] });
    const originalIdCardPathRef = useRef(null);
    const [kycStatus, setKycStatus] = useState("unknown");
    const [kycRemark, setKycRemark] = useState(null);

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

        const safeProfile = profile ?? {};
        const [birthYear, birthMonth, birthDay] = safeProfile.birth_date?.split("-") ?? [];

        setKycStatus(safeProfile.is_kyc ?? "unknown");
        setKycRemark(safeProfile.kyc_remark ?? null);

        const formatData = {
            id: userId,
            ...safeProfile,
            email: userEmail,
            firstName: safeProfile.first_name ?? "",
            lastName: safeProfile.last_name ?? "",
            phone: safeProfile.phone ?? "",
            gender: safeProfile.gender ?? undefined,
            birthDay,
            birthMonth,
            birthYear,
            profile_image: safeProfile.profile_image
                ? [
                      {
                          uid: safeProfile.profile_image.split("/").pop(),
                          url: safeProfile.profile_image,
                          status: "done",
                      },
                  ]
                : [],
            id_card_image: [],
        };
        originalFilesRef.current = {
            profile: formatData.profile_image,
            idCard: [],
        };
        originalIdCardPathRef.current = safeProfile.id_card_image || null;

        if (safeProfile.id_card_image) {
            const { data: signed } = await createIdCardSignedUrl(safeProfile.id_card_image, 300);
            if (signed?.signedUrl) {
                formatData.id_card_image = [
                    {
                        uid: safeProfile.id_card_image.split("/").pop(),
                        url: signed.signedUrl,
                        status: "done",
                    },
                ];
                originalFilesRef.current.idCard = formatData.id_card_image;
            }
        }

        reset(formatData);
    };

    const onSubmit = async (value) => {
        try {
            const uploadedProfile = await uploadPendingFiles(value?.profile_image || []);

            let idCardPath = originalIdCardPathRef.current;
            const idCardFile = value?.id_card_image?.[0];
            if (idCardFile?.originFileObj) {
                const f = idCardFile.originFileObj;
                const err = await validateImageFile(f);
                if (err) {
                    notifyError(new Error(fileErrorMessage(err)));
                    return;
                }
                const { path, error: upErr } = await uploadIdCard({ userId: value.id, uid: idCardFile.uid, file: f });
                if (upErr) {
                    notifyError(upErr);
                    return;
                }
                if (originalIdCardPathRef.current && originalIdCardPathRef.current !== path) {
                    await removeIdCard(originalIdCardPathRef.current);
                }
                idCardPath = path;
            } else if (!idCardFile) {
                if (originalIdCardPathRef.current) {
                    await removeIdCard(originalIdCardPathRef.current);
                }
                idCardPath = null;
            }

            const profileImageUrl = uploadedProfile[0]?.url ?? null;

            const payload = kycMode
                ? {
                      profile_image: profileImageUrl,
                      id_card_image: idCardPath,
                  }
                : {
                      first_name: value.firstName,
                      last_name: value.lastName,
                      profile_image: profileImageUrl,
                      id_card_image: idCardPath,
                      gender: value.gender,
                      phone: value.phone,
                      birth_date:
                          value.birthYear && value.birthMonth && value.birthDay
                              ? `${value.birthYear}-${value.birthMonth}-${value.birthDay}`
                              : null,
                  };

            const { error } = await updateProfileById(value.id, payload);
            if (error) return notifyError(error);
            if (!kycMode && value.password) {
                const { error: passwordError } = await updatePassword(value.password);
                if (passwordError) return notifyError(passwordError);
            }
            await removeDeletedFiles(originalFilesRef.current.profile, value?.profile_image || []);
            originalIdCardPathRef.current = idCardPath;

            if (kycMode) {
                const { error: rpcError } = await supabase.rpc("submit_kyc", { p_user_id: value.id });
                if (rpcError) return notifyError(rpcError);
                setKycStatus("pending");
                setKycRemark(null);
                dispatch(fetchUser());
                notifySuccess("ส่งเอกสารยืนยันตัวตนสำเร็จ รอ admin ตรวจสอบ");
                onKycSubmitted?.();

                onSubmitSaveProduct();
                fetchUserAndProfile();
                return;
            }

            notifySuccess("บันทึกข้อมูลสำเร็จ");
        } catch (error) {
            notifyError(error);
        }
    };

    const tag = KYC_TAG[kycStatus] ?? KYC_TAG.unknown;

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

            {!kycMode && (
                <>
                    <InputText control={control} name="email" label="อีเมล" size="large" />
                    <div className="flex gap-4 items-start">
                        <InputText control={control} name="phone" label="เบอร์โทรศัพท์" size="large" />
                        <UseSelect control={control} name="gender" label="เพศ" size="large" options={genderList} />
                    </div>
                    <div className="flex gap-4 items-start">
                        <InputText control={control} name="firstName" label="ชื่อ" size="large" />
                        <InputText control={control} name="lastName" label="นามสกุล" size="large" />
                    </div>
                    <div className="flex gap-4 items-start">
                        <UseSelect
                            control={control}
                            name="birthDay"
                            label="วันเดือนปีเกิด"
                            size="large"
                            options={birthDayList}
                            placeholder="โปรดระบุ วัน"
                        />
                        <UseSelect
                            control={control}
                            name="birthMonth"
                            label=" "
                            size="large"
                            options={birthMonthList}
                            placeholder="โปรดระบุ เดือน"
                        />
                        <UseSelect
                            control={control}
                            name="birthYear"
                            label=" "
                            size="large"
                            options={birthYearList()}
                            placeholder="โปรดระบุ ปี"
                        />
                    </div>
                    <UseInputPassword control={control} name="password" label="รหัสผ่าน" size="large" />
                </>
            )}

            {kycMode && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    กรุณาอัปโหลดรูปโปรไฟล์และสำเนาบัตรประชาชนเพื่อยืนยันตัวตนก่อนลงขายสินค้า
                </p>
            )}

            <div className="flex gap-4 items-start">
                <UseUpload
                    control={control}
                    name="profile_image"
                    label="รูปโปรไฟล์"
                    maxCount={1}
                    customRequest={(fileData) =>
                        handleLocalPreview({ fileData: fileData, name: "profile_image", setValue: setValue })
                    }
                />
                <UseUpload
                    control={control}
                    name="id_card_image"
                    label="สำเนาบัตรประชาชน"
                    maxCount={1}
                    customRequest={(fileData) =>
                        handleLocalPreview({ fileData: fileData, name: "id_card_image", setValue: setValue })
                    }
                />
            </div>
            <div className="flex justify-end gap-2 ">
                <UseButton type="default" label="ปิด" onClick={() => setIsOpenModalProfile?.(false)} />
                <UseButton label={kycMode ? "ส่งเอกสารยืนยัน" : "บันทึก"} htmlType="submit" />
            </div>
        </form>
    );
}

export default UserProfilesForm;
