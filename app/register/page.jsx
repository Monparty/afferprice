"use client";
import InputText from "../components/inputs/InputText";
import { useForm, useWatch } from "react-hook-form";
import UseButton from "../components/inputs/UseButton";
import { GoogleOutlined } from "@ant-design/icons";
import { useState } from "react";
import Image from "next/image";
import afferpriceLogo from "../../public/images/afferpriceLogo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import UseSelect from "../components/inputs/UseSelect";
import { genderList, birthDayList, birthMonthList, birthYearList } from "./dataSelect";
import UseInputPassword from "../components/inputs/UseInputPassword";
import Link from "next/link";

function Page() {
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const [showOtherField, setShowOtherField] = useState(false);
    const step1Fields = ["email", "phone", "gender"];
    const step2Fields = ["firstName", "lastName", "birthDay", "birthMonth", "birthYear", "password"];

    const step1Values = useWatch({ control, name: step1Fields });
    const step2Values = useWatch({ control, name: step2Fields });

    const isStep1Ready = step1Values.every(Boolean) && step1Fields.every((f) => !errors[f]);
    const isStep2Ready = step2Values.every(Boolean) && step2Fields.every((f) => !errors[f]);

    const onSubmit = (values) => {
        console.log("values onSubmit", values);
    };

    return (
        <main className="grid place-items-center">
            <div className="w-2/5 space-y-4 text-center">
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
                            <UseInputPassword control={control} name="password" label="รหัสผ่าน" size="large" />
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
                                    options={birthYearList}
                                    placeholder="โปรดระบุ ปี"
                                />
                            </div>
                        </>
                    )}
                    {!showOtherField && (
                        <UseButton
                            label="ดำเนินการต่อ"
                            size="large"
                            wFull
                            onClick={() => {
                                setShowOtherField(!showOtherField);
                            }}
                            disabled={!isStep1Ready}
                        />
                    )}
                    {showOtherField && (
                        <UseButton
                            label="ลงทะเบียน"
                            size="large"
                            wFull
                            htmlType="submit"
                            disabled={!isStep2Ready || !isStep1Ready}
                        />
                    )}
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 w-full"></div>
                        {!showOtherField && (
                            <UseButton
                                label="ลงทะเบียนด้วย Google"
                                icon={GoogleOutlined}
                                type="default"
                                size="large"
                                wFull
                            />
                        )}
                    </div>
                    <Link href="/login">
                        <UseButton label="มีบัญชีอยู่แล้ว ล็อกอิน" size="large" type="default" wFull />
                    </Link>
                </form>
            </div>
        </main>
    );
}

export default Page;
