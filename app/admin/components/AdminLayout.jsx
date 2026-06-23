"use client";
import Image from "next/image";
import Link from "next/link";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import {
    BarChartOutlined,
    BellOutlined,
    CarOutlined,
    CreditCardOutlined,
    ExceptionOutlined,
    FileTextOutlined,
    HistoryOutlined,
    InboxOutlined,
    LogoutOutlined,
    MoonOutlined,
    NotificationOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    SunOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import UseAvatar from "@/app/components/utils/UseAvatar";
import UsePopover from "@/app/components/utils/UsePopover";
import UseButton from "@/app/components/inputs/UseButton";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES } from "../constants/routes";
import { logout } from "@/app/services/auth.service";
import { getAdminBadgeCounts } from "@/app/services/admin/badges.service";
import { getProfileById } from "@/app/services/profile.service";
import { supabase } from "@/app/lib/supabase/client";
import { useTheme } from "@/app/providers/ThemeProvider";
import AdminNotificationDrawer from "./AdminNotificationDrawer";

const menus = [
    { url: ROUTES.ADMIN, label: "แดชบอร์ด", icon: <BarChartOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_PRODUCT, label: "จัดการสินค้าประมูล", icon: <ShoppingCartOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_BID, label: "ตรวจสอบการ bid", icon: <InboxOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_AUCTION_RESULTS, label: "หลังจากประมูลจบ", icon: <HistoryOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_SHIPMENTS, label: "การจัดส่ง", icon: <CarOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_PAYMENTS, label: "การชำระเงิน", icon: <CreditCardOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_WALLET, label: "กระเป๋าเงิน", icon: <WalletOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_USERS, label: "จัดการผู้ใช้งาน", icon: <UserOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_CATEGORIES, label: "จัดการหมวดหมู่สินค้า", icon: <ShopOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_NOTIFICATIONS, label: "การแจ้งเตือน", icon: <NotificationOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_REPORTS, label: "รายงาน", icon: <FileTextOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_ISSUES, label: "ระบบแจ้งปัญหา", icon: <ExceptionOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_SETTINGS, label: "การตั้งค่า", icon: <SettingOutlined className="text-lg!" /> },
];

function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const headerName = menus.find((item) => item.url.split("/")[2] === pathname.split("/")[2])?.label || "";

    // จำนวน badge ต่อเมนู (keyed by route) — refetch เมื่อเปลี่ยนหน้าเพื่อให้ค่าอัปเดตหลัง admin จัดการ
    const [badgeCounts, setBadgeCounts] = useState({});
    useEffect(() => {
        getAdminBadgeCounts()
            .then(setBadgeCounts)
            .catch(() => {});
    }, [pathname]);

    // ผู้ใช้ที่ login อยู่ (admin) — fetchUser ไม่ได้ dispatch ทุกหน้า จึงอ่านตรงจาก Supabase
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        (async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await getProfileById(user.id);
            if (data) setProfile(data);
        })();
    }, []);

    const adminName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "ผู้ดูแลระบบ";
    const adminRole = profile?.role === "admin" ? "Admin" : profile?.role || "";

    // drawer การแจ้งเตือนระบบ
    const [openNoti, setOpenNoti] = useState(false);

    // สลับโหมดสว่าง/มืด (theme เก็บใน localStorage ผ่าน ThemeProvider)
    const { isDark, toggleTheme } = useTheme();

    // logout
    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    return (
        <div className="flex">
            <div className="w-1/6">
                <nav className="bg-slate-800 text-white p-6 h-dvh w-1/6 fixed">
                    <Link href={ROUTES.ADMIN} className="flex-2 flex items-center gap-3 mb-6">
                        <Image src={afferpriceLogo} width={34} height={34} alt="Afferprice Logo" />
                        <h1 className="text-xl font-semibold">Afferprice</h1>
                    </Link>
                    <div className="flex flex-col h-[calc(100%-120px)] min-h-fit">
                        <div className="grid gap-3">
                            {menus.map((menu, index) => (
                                <Link
                                    key={index}
                                    href={menu.url}
                                    className={`${headerName === menu.label ? "bg-orange-500/25 text-orange-500" : ""} flex items-center gap-3 p-2 rounded-lg hover:bg-orange-500/25 hover:text-orange-500`}
                                >
                                    {menu.icon}
                                    {menu.label}
                                    {badgeCounts[menu.url] > 0 && (
                                        <span className="ml-auto text-white bg-orange-600 h-5 min-w-5 p-1 text-[10px] font-medium flex items-center justify-center rounded-sm leading-4">
                                            {badgeCounts[menu.url] > 99 ? "99+" : badgeCounts[menu.url]}
                                        </span>
                                    )}
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
                                <UseAvatar src={profile?.profile_image || undefined} icon={UserOutlined} />
                                <div className="grid">
                                    <p className="text-sm">{adminName}</p>
                                    <p className="text-xs text-slate-400">{adminRole}</p>
                                </div>
                            </div>
                        </UsePopover>
                    </div>
                </nav>
            </div>
            <div className="w-5/6">
                <header className="px-6 h-12 flex items-center justify-between bg-slate-100 dark:bg-slate-900 dark:border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold dark:text-slate-100">{headerName}</h2>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center cursor-pointer hover:text-orange-500"
                            title={isDark ? "สลับโหมดสว่าง" : "สลับโหมดมืด"}
                        >
                            {isDark ? <SunOutlined className="text-lg!" /> : <MoonOutlined className="text-lg!" />}
                        </button>
                        <BellOutlined
                            className="text-lg! cursor-pointer hover:text-orange-500"
                            onClick={() => setOpenNoti(true)}
                        />
                        <QuestionCircleOutlined className="text-lg!" />
                    </div>
                </header>
                <div className="p-6">{children}</div>
            </div>
            <AdminNotificationDrawer open={openNoti} onClose={() => setOpenNoti(false)} />
        </div>
    );
}

export default AdminLayout;
