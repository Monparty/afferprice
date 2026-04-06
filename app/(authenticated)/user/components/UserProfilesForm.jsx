"use client";
import InputText from "@/app/components/inputs/InputText";
import UseInputPassword from "@/app/components/inputs/UseInputPassword";
import UseSelect from "@/app/components/inputs/UseSelect";
import { genderList, birthDayList, birthMonthList, birthYearList } from "../../../utils/dataSelect";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getProfileById, updateProfileById } from "@/app/services/profile.service";
import { getCurrentUser } from "@/app/services/auth.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import UseUpload from "@/app/components/inputs/UseUpload";
import UseButton from "@/app/components/inputs/UseButton";
import { handleRemove, handleUpload } from "@/app/utils/storageHelper";

function UserProfilesForm({ setIsOpenModalProfile }) {
    const {
        handleSubmit,
        control,
        reset,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm();
    const id = getValues("id");

    useEffect(() => {
        const fetchUserAndProfile = async () => {
            const { data: currentUserData, error: userError } = await getCurrentUser();
            if (userError) return notifyError(userError);
            const userId = currentUserData.user?.id;
            const userEmail = currentUserData.user?.email;
            if (!userId) return;
            const { data: profile, error: profileError } = await getProfileById(userId);
            if (profileError) return notifyError(profileError);

            const formatData = {
                ...profile,
                email: userEmail,
                firstName: profile.first_name,
                lastName: profile.last_name,
                birthDay: profile.birth_date.split("-")[2],
                birthMonth: profile.birth_date.split("-")[1],
                birthYear: profile.birth_date.split("-")[0],
                profile_image: profile.profile_image && [{ url: profile.profile_image }],
                id_card_image: profile.id_card_image && [{ url: profile.id_card_image }],
            };
            reset(formatData);
        };
        fetchUserAndProfile();
    }, [reset]);

    const onSubmit = async (value) => {
        const birthDate = `${value.birthYear}-${value.birthMonth}-${value.birthDay}`;
        const payload = {
            first_name: value.firstName,
            last_name: value.lastName,
            profile_image: value.profile_image?.[0]?.url,
            id_card_image: value.id_card_image?.[0]?.url,
            gender: value.gender,
            phone: value.phone,
            birth_date: birthDate,
        };
        const { error } = await updateProfileById(value.id, payload);
        if (error) return notifyError(error);
        notifySuccess("บันทึกข้อมูลสำเร็จ");
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
                        handleUpload({ fileData: fileData, name: "profile_image", setValue: setValue })
                    }
                    onRemove={(fileData) =>
                        handleRemove({
                            fileData: fileData,
                            field: "profile_image",
                            id: id,
                            updateFunction: updateProfileById,
                            setValue: setValue,
                        })
                    }
                />
                <UseUpload
                    control={control}
                    name="id_card_image"
                    label="สำเนาบัตรประชาชน"
                    maxCount={1}
                    customRequest={(fileData) =>
                        handleUpload({ fileData: fileData, name: "id_card_image", setValue: setValue })
                    }
                    onRemove={(fileData) =>
                        handleRemove({
                            fileData: fileData,
                            field: "id_card_image",
                            id: id,
                            updateFunction: updateProfileById,
                            setValue: setValue,
                        })
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
