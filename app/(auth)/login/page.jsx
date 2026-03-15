"use client";
import Image from "next/image";
import Link from "next/link";
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

function Page() {
    const {
        handleSubmit,
        control,
        watch,
        formState: { isValid },
    } = useForm({
        // resolver: yupResolver(schema),
        mode: "onBlur",
    });
    const router = useRouter();

    const onSubmit = async (values) => {
        console.log("values onSubmit", values);
        const { data, error } = await login("test@test.com", "123456"); // ม่ายต้องพิมพ์
        // const { data, error } = await login(values.email, values.password);

        if (error) return notifyError(error);
        alert("ห้ามเข้า")
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
                {/* <UseButton label="เข้าสู่ระบบ" size="large" wFull htmlType="submit" disabled={!isValid} /> */}
                {/* ใช้ test */}
                <UseButton label="เข้าสู่ระบบ" size="large" wFull htmlType="submit" />
                <div className="border-b border-gray-200 w-full"></div>
                <Link href="/register">
                    <UseButton label="ยังไม่มีบัญชี สมัครสมาชิก" size="large" type="default" wFull />
                </Link>
            </form>
        </main>
    );
}

export default Page;
