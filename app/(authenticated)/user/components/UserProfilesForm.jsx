"use client";
import InputText from "@/app/components/inputs/InputText";
import UseInputPassword from "@/app/components/inputs/UseInputPassword";
import UseSelect from "@/app/components/inputs/UseSelect";
import { genderList, birthDayList, birthMonthList, birthYearList } from "../../../utils/dataSelect";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getProfileById } from "@/app/services/profile.service";
import { getCurrentUser } from "@/app/services/auth.service";
import { notifyError } from "@/app/providers/NotificationProvider";

function UserProfilesForm() {
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();

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
            };
            reset(formatData);
        };
        fetchUserAndProfile();
    }, [reset]);

    const onSubmit = (values) => {
        console.log("values onSubmit", values);
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
        </form>
    );
}

export default UserProfilesForm;
