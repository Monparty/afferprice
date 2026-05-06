"use client";
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import { genderList, birthDayList, birthMonthList, birthYearList } from "../../utils/dataSelect";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import InputText from "../../components/inputs/InputText";
import UseButton from "../../components/inputs/UseButton";
import UseSelect from "../../components/inputs/UseSelect";
import UseInputPassword from "../../components/inputs/UseInputPassword";
import { useRouter } from "next/navigation";
import { register } from "../../services/auth.service";
import { notifyError, notifySuccess } from "../../providers/NotificationProvider";
import LoginWithGoogleBtn from "../components/LoginWithGoogleBtn";

function Page() {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });
    const router = useRouter();

    const [showOtherField, setShowOtherField] = useState(false);
    const [loading, setLoading] = useState(false);
    const step1Fields = ["email", "phone", "gender"];
    const step2Fields = ["firstName", "lastName", "birthDay", "birthMonth", "birthYear", "password"];

    const step1Values = useWatch({ control, name: step1Fields });
    const step2Values = useWatch({ control, name: step2Fields });

    const isStep1Ready = step1Values.every(Boolean) && step1Fields.every((f) => !errors[f]);
    const isStep2Ready = step2Values.every(Boolean) && step2Fields.every((f) => !errors[f]);

    const onSubmit = async (values) => {
        setLoading(true);
        const { error } = await register(values);
        setLoading(false);
        if (error) return notifyError(error);
        notifySuccess("สมัครสมาชิกสำเร็จ");
        router.push("/");
    };

    return (
        <main className="w-2/5 space-y-4 text-center">
            <h2 className="font-bold text-2xl flex items-center justify-center gap-3">
                <Image src={afferpriceLogo} width={32} height={32} alt="Afferprice Logo" />
                เข้าร่วมกับ Afferprice วันนี้
            </h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark::bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark::border-gray-800 grid gap-4"
            >
                <InputText control={control} name="email" label="อีเมล" size="large" />
                <div className="flex gap-4 items-start">
                    <InputText control={control} name="phone" label="เบอร์โทรศัพท์" size="large" />
                    <UseSelect control={control} name="gender" label="เพศ" size="large" options={genderList} />
                </div>
                {showOtherField && (
                    <>
                        <div className="flex gap-4 items-start">
                            <InputText control={control} name="firstName" label="ชื่อ" size="large" />
                            <InputText control={control} name="lastName" label="นามสกุล" size="large" />
                        </div>
                        <div className="flex gap-4 items-end">
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
                                size="large"
                                options={birthMonthList}
                                placeholder="โปรดระบุ เดือน"
                            />
                            <UseSelect
                                control={control}
                                name="birthYear"
                                size="large"
                                options={birthYearList()}
                                placeholder="โปรดระบุ ปี"
                            />
                        </div>
                        <UseInputPassword control={control} name="password" label="รหัสผ่าน" size="large" />
                    </>
                )}
                {!showOtherField && (
                    <UseButton
                        label="ดำเนินการต่อ"
                        size="large"
                        wFull
                        onClick={() => setShowOtherField(true)}
                        disabled={!isStep1Ready}
                    />
                )}
                {showOtherField && (
                    <UseButton
                        label="ลงทะเบียน"
                        size="large"
                        wFull
                        htmlType="submit"
                        loading={loading}
                        disabled={!isStep2Ready || !isStep1Ready}
                    />
                )}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <div className="flex-1 border-b border-gray-200"></div>
                        หรือ
                        <div className="flex-1 border-b border-gray-200"></div>
                    </div>
                    {!showOtherField && <LoginWithGoogleBtn />}
                </div>
                <UseButton
                    label="มีบัญชีอยู่แล้ว ล็อกอิน"
                    size="large"
                    type="default"
                    wFull
                    onClick={() => router.push("/login")}
                />
                <UseButton
                    label="กลับหน้าแรก"
                    size="large"
                    type="link"
                    wFull
                    className="text-slate-500! text-sm!"
                    onClick={() => router.push("/")}
                />
                <p className="text-xs text-slate-400 leading-relaxed">
                    การลงทะเบียนถือว่าคุณยอมรับ{" "}
                    <a
                        href="/documents/Afferprice_Full_Terms_and_Conditions.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-slate-600"
                    >
                        ข้อกำหนดการใช้งาน
                    </a>{" "}
                    และ{" "}
                    <a
                        href="/documents/Afferprice_Privacy_Policy.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-slate-600"
                    >
                        นโยบายความเป็นส่วนตัว
                    </a>
                </p>
            </form>
        </main>
    );
}

export default Page;
