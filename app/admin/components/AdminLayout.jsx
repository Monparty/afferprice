"use client";
import Image from "next/image";
import Link from "next/link";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import { BellOutlined, LogoutOutlined, QuestionCircleOutlined, UserOutlined } from "@ant-design/icons";
import UseAvatar from "@/app/components/utils/UseAvatar";
import UsePopover from "@/app/components/utils/UsePopover";
import UseButton from "@/app/components/inputs/UseButton";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "../constants/routes";
import { logout } from "@/app/services/auth.service";

function AdminLayout({ children, menus }) {
    const router = useRouter();
    const pathname = usePathname();
    const headerName = menus.find((item) => item.url.split("/")[2] === pathname.split("/")[2])?.label || "";

    // logout
    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <>
            <div className="w-1/6">
                <nav className="bg-slate-800 text-white p-6 h-dvh w-1/6 fixed">
                    <Link href={ROUTES.ADMIN} className="flex-2 flex items-center gap-3 mb-6">
                        <Image src={afferpriceLogo} width={34} height={34} alt="Afferprice Logo" />
                        <h1 className="text-xl font-semibold">Afferprice</h1>
                    </Link>
                    <div className="flex flex-col h-[calc(100%-120px)]">
                        <div className="grid gap-3">
                            {menus.map((menu, index) => (
                                <Link
                                    key={index}
                                    href={menu.url}
                                    className={`${headerName === menu.label ? "bg-orange-500/25 text-orange-500" : ""} flex items-center gap-3 p-2 rounded-lg hover:bg-orange-500/25 hover:text-orange-500`}
                                >
                                    {menu.icon}
                                    {menu.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-slate-500 pt-3">
                        <UsePopover
                            placement="topLeft"
                            content={
                                <div className="grid gap-2 w-46">
                                    <Link href="/user">
                                        <UseButton
                                            label="ข้อมูลผู้ใช้"
                                            className="justify-start! h-10!"
                                            type="text"
                                            icon={UserOutlined}
                                            wFull
                                        />
                                    </Link>
                                    <UseButton
                                        label="ออกจากระบบ"
                                        className="justify-start! h-10!"
                                        type="text"
                                        icon={LogoutOutlined}
                                        wFull
                                        onClick={() => handleLogout()}
                                    />
                                </div>
                            }
                        >
                            <div className="flex gap-3 items-center p-2 rounded-lg transition-all hover:bg-slate-700 ">
                                <UseAvatar src="https://picsum.photos/30/30" />
                                <div className="grid">
                                    <p className="text-sm">นายสมชาย ควายธนู</p>
                                    <p className="text-xs text-slate-400">Super Admin</p>
                                </div>
                            </div>
                        </UsePopover>
                    </div>
                </nav>
            </div>
            <div className="w-5/6">
                <header className="px-6 h-12 flex items-center justify-between bg-slate-100">
                    <h2 className="text-xl font-bold">{headerName}</h2>
                    <div className="flex gap-6">
                        <BellOutlined className="text-lg!" />
                        <QuestionCircleOutlined className="text-lg!" />
                    </div>
                </header>
                <div className="p-6">{children}</div>
            </div>
        </>
    );
}

export default AdminLayout;
