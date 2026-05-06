"use client";
import Image from "next/image";
import { schema } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../../services/auth.service";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import InputText from "../../components/inputs/InputText";
import UseButton from "../../components/inputs/UseButton";
import UseInputPassword from "../../components/inputs/UseInputPassword";
import { notifyError } from "@/app/providers/NotificationProvider";
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
    const router = useRouter();

    const onSubmit = async (values) => {
        const { error } = await login(values.email, values.password);

        if (error) return notifyError(error);
        router.push("/");
    };

    return (
        <main className="w-2/5 space-y-4 text-center">
            <h2 className="font-bold text-2xl flex items-center justify-center gap-3">
                <Image src={afferpriceLogo} width={32} height={32} alt="Afferprice Logo" />
                เข้าสู่ระบบ
            </h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white dark::bg-zinc-900 rounded-xl shadow-xl p-6 border border-gray-100 dark::border-gray-800 grid gap-4"
            >
                <InputText control={control} name="email" label="อีเมล" size="large" />
                <UseInputPassword control={control} name="password" label="รหัสผ่าน" size="large" />
                <UseButton label="เข้าสู่ระบบ" size="large" wFull htmlType="submit" disabled={!isValid} />
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <div className="flex-1 border-b border-gray-200"></div>
                    หรือ
                    <div className="flex-1 border-b border-gray-200"></div>
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
        </main>
    );
}

export default Page;
