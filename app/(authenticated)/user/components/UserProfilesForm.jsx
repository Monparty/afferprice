"use client";
import InputText from "@/app/components/inputs/InputText";
import UseInputPassword from "@/app/components/inputs/UseInputPassword";
import UseSelect from "@/app/components/inputs/UseSelect";
import { genderList, birthDayList, birthMonthList, birthYearList } from "../../../utils/dataSelect";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { getProfileById, updateProfileById } from "@/app/services/profile.service";
import { getCurrentUser, updatePassword } from "@/app/services/auth.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import UseUpload from "@/app/components/inputs/UseUpload";
import UseButton from "@/app/components/inputs/UseButton";
import { handleLocalPreview, removeDeletedFiles, uploadPendingFiles } from "@/app/utils/storageHelper";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";

function UserProfilesForm({ setIsOpenModalProfile }) {
    const { handleSubmit, control, reset, setValue, getValues } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });
    const id = getValues("id");
    const originalFilesRef = useRef({ profile: [], idCard: [] });

    useEffect(() => {
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
                id_card_image: safeProfile.id_card_image
                    ? [
                          {
                              uid: safeProfile.id_card_image.split("/").pop(),
                              url: safeProfile.id_card_image,
                              status: "done",
                          },
                      ]
                    : [],
            };
            originalFilesRef.current = {
                profile: formatData.profile_image,
                idCard: formatData.id_card_image,
            };

            reset(formatData);
        };
        fetchUserAndProfile();
    }, [reset]);

    const onSubmit = async (value) => {
        try {
            const uploadedProfile = await uploadPendingFiles(value?.profile_image || []);
            const uploadedIdCard = await uploadPendingFiles(value?.id_card_image || []);
            const birthDate =
                value.birthYear && value.birthMonth && value.birthDay
                    ? `${value.birthYear}-${value.birthMonth}-${value.birthDay}`
                    : null;
            const payload = {
                first_name: value.firstName,
                last_name: value.lastName,
                profile_image: uploadedProfile[0]?.url ?? null,
                id_card_image: uploadedIdCard[0]?.url ?? null,
                gender: value.gender,
                phone: value.phone,
                birth_date: birthDate,
            };
            const { error } = await updateProfileById(value.id, payload);
            if (error) return notifyError(error);
            if (value.password) {
                const { error: passwordError } = await updatePassword(value.password);
                if (passwordError) return notifyError(passwordError);
            }
            await removeDeletedFiles(originalFilesRef.current.profile, value?.profile_image || []);
            await removeDeletedFiles(originalFilesRef.current.idCard, value?.id_card_image || []);
            notifySuccess("บันทึกข้อมูลสำเร็จ");
        } catch (error) {
            notifyError(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
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
                    label=" "
                    size="large"
                    options={birthMonthList}
                    placeholder="โปรดระบุ เดือน"
                />
                <UseSelect
                    control={control}
                    name="birthYear"
                    label=" "
                    size="large"
                    options={birthYearList()}
                    placeholder="โปรดระบุ ปี"
                />
            </div>
            <UseInputPassword control={control} name="password" label="รหัสผ่าน" size="large" />
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
                <UseButton type="default" label="ปิด" onClick={() => setIsOpenModalProfile(false)} />
                <UseButton label="บันทึก" htmlType="submit" />
            </div>
        </form>
    );
}

export default UserProfilesForm;
