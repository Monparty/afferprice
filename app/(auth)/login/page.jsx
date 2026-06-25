"use client";
import Image from "next/image";
import { useState } from "react";
import { schema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { login, sendEmailOtp, verifyEmailOtp } from "../../services/auth.service";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import InputText from "../../components/inputs/InputText";
import UseButton from "../../components/inputs/UseButton";
import UseInputPassword from "../../components/inputs/UseInputPassword";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import LoginWithGoogleBtn from "../components/LoginWithGoogleBtn";

function Page() {
    const {
        handleSubmit,
        control,
        formState: { isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });
    const otpForm = useForm({ mode: "onChange", defaultValues: { otpEmail: "", otpCode: "" } });
    const router = useRouter();

    const [mode, setMode] = useState("password"); // "password" | "otp"
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    const onSubmit = async (values) => {
        const { error } = await login(values.email, values.password);
        if (error) return notifyError(error);
        router.push("/");
    };

    const handleSendOtp = async () => {
        const email = otpForm.getValues("otpEmail")?.trim();
        if (!email) return notifyError("กรุณากรอกอีเมล");
        setOtpLoading(true);
        const { error } = await sendEmailOtp(email);
        setOtpLoading(false);
        if (error) return notifyError(error);
        setOtpSent(true);
        notifySuccess("ส่งรหัส OTP ไปที่อีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย");
    };

    const handleVerifyOtp = async () => {
        const email = otpForm.getValues("otpEmail")?.trim();
        const token = otpForm.getValues("otpCode")?.trim();
        if (!token) return notifyError("กรุณากรอกรหัส OTP");
        setOtpLoading(true);
        const { error } = await verifyEmailOtp(email, token);
        setOtpLoading(false);
        if (error) return notifyError(error);
        router.push("/");
    };

    const switchMode = (next) => {
        setMode(next);
        setOtpSent(false);
    };

    return (
        <main className="w-full max-w-md sm:w-2/5 space-y-4 text-center">
            <h2 className="font-bold text-2xl flex items-center justify-center gap-3">
                <Image src={afferpriceLogo} width={32} height={32} alt="Afferprice Logo" />
                เข้าสู่ระบบ
            </h2>

            {mode === "password" ? (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800 grid gap-4"
                >
                    <InputText control={control} name="email" label="อีเมล" size="large" />
                    <UseInputPassword control={control} name="password" label="รหัสผ่าน" size="large" />
                    <UseButton label="เข้าสู่ระบบ" size="large" wFull htmlType="submit" disabled={!isValid} />
                    <UseButton
                        label="เข้าสู่ระบบด้วยรหัส OTP (อีเมล)"
                        size="large"
                        type="default"
                        wFull
                        onClick={() => switchMode("otp")}
                    />
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <div className="flex-1 border-b border-gray-200 dark:border-zinc-700"></div>
                        หรือ
                        <div className="flex-1 border-b border-gray-200 dark:border-zinc-700"></div>
                    </div>
                    <LoginWithGoogleBtn />
                    <UseButton
                        label="ยังไม่มีบัญชี สมัครสมาชิก"
                        size="large"
                        type="default"
                        wFull
                        onClick={() => router.push("/register")}
                    />
                    <UseButton
                        label="กลับหน้าแรก"
                        size="large"
                        type="link"
                        wFull
                        className="text-slate-500! text-sm!"
                        onClick={() => router.push("/")}
                    />
                </form>
            ) : (
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-zinc-800 grid gap-4">
                    <InputText
                        control={otpForm.control}
                        name="otpEmail"
                        label="อีเมล"
                        size="large"
                        disabled={otpSent}
                    />
                    {!otpSent ? (
                        <UseButton label="ส่งรหัส OTP" size="large" wFull loading={otpLoading} onClick={handleSendOtp} />
                    ) : (
                        <>
                            <InputText control={otpForm.control} name="otpCode" label="รหัส OTP 6 หลัก" size="large" />
                            <UseButton
                                label="ยืนยันรหัส OTP"
                                size="large"
                                wFull
                                loading={otpLoading}
                                onClick={handleVerifyOtp}
                            />
                            <UseButton
                                label="ส่งรหัสอีกครั้ง"
                                size="large"
                                type="default"
                                wFull
                                loading={otpLoading}
                                onClick={handleSendOtp}
                            />
                        </>
                    )}
                    <UseButton
                        label="ใช้รหัสผ่านแทน"
                        size="large"
                        type="link"
                        wFull
                        className="text-slate-500! text-sm!"
                        onClick={() => switchMode("password")}
                    />
                </div>
            )}
        </main>
    );
}

export default Page;
