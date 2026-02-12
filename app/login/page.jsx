"use client";
import InputText from "../components/inputs/InputText";
import { useForm } from "react-hook-form";
import UseButton from "../components/inputs/UseButton";
import { GoogleOutlined } from "@ant-design/icons";
import { useState } from "react";
import Image from "next/image";
import afferpriceLogo from "../../public/images/afferpriceLogo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import UseSelect from "../components/inputs/UseSelect";

function Page() {
    const {
        control,
        watch,
        setValue,
        formState: { isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const [showOtherField, setShowOtherField] = useState(false);
    const mockOption = [{}];

    return (
        <main className="grid place-items-center">
            <div className="w-2/5 space-y-4 text-center">
                <h2 className="font-bold text-2xl flex items-center justify-center gap-3">
                    <Image src={afferpriceLogo} width={32} height={32} alt="Afferprice Logo" />
                    เข้าร่วมกับ Afferprice วันนี้
                </h2>
                <div className="bg-white dark::bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark::border-gray-800 grid gap-4">
                    <InputText control={control} name="email" label="อีเมล" size="large" />
                    <InputText control={control} name="phone" label="เบอร์โทรศัพท์" size="large" />
                    {showOtherField && (
                        <>
                            <div className="flex gap-4 items-start">
                                <InputText control={control} name="1" label="ชื่อ" size="large" />
                                <InputText control={control} name="2" label="นามสกุล" size="large" />
                            </div>
                            <InputText control={control} name="3" type="password" label="รหัสผ่าน" size="large" />
                            <div className="flex gap-4 items-start">
                                <UseSelect
                                    control={control}
                                    name="4"
                                    label="วันเดือนปีเกิด"
                                    size="large"
                                    options={mockOption}
                                />
                                <UseSelect control={control} name="5" size="large" options={mockOption} />
                                <UseSelect control={control} name="6" size="large" options={mockOption} />
                            </div>
                        </>
                    )}
                    <UseButton
                        label="ดำเนินการต่อ"
                        size="large"
                        wFull
                        onClick={() => setShowOtherField(!showOtherField)}
                        disabled={!isValid}
                    />
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 w-full"></div>
                        <UseButton
                            label="ลงทะเบียนด้วย Google"
                            icon={GoogleOutlined}
                            type="default"
                            size="large"
                            wFull
                        />
                    </div>
                    <UseButton label="มีบัญชีอยู่แล้ว ล็อกอิน" size="large" type="default" wFull />
                </div>
            </div>
        </main>
    );
}

export default Page;
