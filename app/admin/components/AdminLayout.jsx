"use client";
import Image from "next/image";
import Link from "next/link";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import {
    BankOutlined,
    BarChartOutlined,
    BellOutlined,
    CarOutlined,
    CloseOutlined,
    CreditCardOutlined,
    ExceptionOutlined,
    FileTextOutlined,
    FolderOutlined,
    HistoryOutlined,
    InboxOutlined,
    LogoutOutlined,
    MenuOutlined,
    MoonOutlined,
    NotificationOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    SunOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    WalletOutlined,
    CalendarOutlined,
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
import UseCollapse from "@/app/components/utils/UseCollapse";

const menus = [
    { url: ROUTES.ADMIN, label: "แดชบอร์ด", icon: <BarChartOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_PRODUCT, label: "จัดการสินค้าประมูล", icon: <ShoppingCartOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_BID, label: "ตรวจสอบการ bid", icon: <InboxOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_AUCTION_RESULTS, label: "หลังจากประมูลจบ", icon: <HistoryOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_SHIPMENTS, label: "การจัดส่ง", icon: <CarOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_PAYMENTS, label: "การชำระเงิน", icon: <CreditCardOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_WALLET, label: "กระเป๋าเงิน", icon: <WalletOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_WITHDRAWALS, label: "คำขอถอนเงิน", icon: <BankOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_USERS, label: "จัดการผู้ใช้งาน", icon: <UserOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_CATEGORIES, label: "จัดการหมวดหมู่สินค้า", icon: <ShopOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_NOTIFICATIONS, label: "การแจ้งเตือน", icon: <NotificationOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_REPORTS, label: "รายงาน", icon: <FileTextOutlined className="text-lg!" /> },
    { url: ROUTES.ADMIN_ISSUES, label: "ระบบแจ้งปัญหา", icon: <ExceptionOutlined className="text-lg!" /> },
];

// เมนูแบบ Accordion (กลุ่ม + เมนูย่อย) — เพิ่ม/แก้กลุ่มที่ array นี้ที่เดียว ไม่กระทบ menus ด้านบน
// ตอนนี้เป็นกลุ่มตัวอย่าง (ลิงก์ซ้ำกับเมนูบน) — แทนที่ด้วยเมนูจริงได้เลย
const accordionMenus = [
    {
        key: "setting",
        label: "การตั้งค่า",
        icon: <SettingOutlined className="text-lg!" />,
        children: [
            { url: ROUTES.ADMIN_SETTINGS, label: "ภาพรวม", icon: <SettingOutlined className="text-lg!" /> },
            {
                url: ROUTES.ADMIN_REPORTS,
                label: "จัดการสภาพสินค้า",
                icon: <ShoppingCartOutlined className="text-lg!" />,
            },
            {
                url: ROUTES.ADMIN_ISSUES,
                label: "จัดการระยะเวลาประมูล",
                icon: <CalendarOutlined className="text-lg!" />,
            },
        ],
    },
];

function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const activeSegment = pathname.split("/")[2];
    // รวมเมนูย่อยใน accordion ด้วย เพื่อให้ header แสดงชื่อหน้าถูกต้องเมื่ออยู่ในเมนูกลุ่ม
    const allMenuItems = [...menus, ...accordionMenus.flatMap((group) => group.children)];
    const headerName = allMenuItems.find((item) => item.url.split("/")[2] === activeSegment)?.label || "";

    // เปิดกลุ่ม accordion ที่มีเมนูย่อย active ค้างไว้ตั้งแต่โหลดหน้า
    const defaultOpenGroups = accordionMenus
        .filter((group) => group.children.some((menu) => menu.url.split("/")[2] === activeSegment))
        .map((group) => group.key);

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

    // เมนู sidebar บนมือถือ (slide-in drawer)
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    useEffect(() => {
        setMobileNavOpen(false);
    }, [pathname]);

    // สลับโหมดสว่าง/มืด (theme เก็บใน localStorage ผ่าน ThemeProvider)
    const { isDark, toggleTheme } = useTheme();

    // logout
    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const navContent = (
        <nav className="bg-slate-800 text-white p-6 h-dvh w-64 flex flex-col overflow-y-auto">
            <Link href={ROUTES.ADMIN} className="flex items-center gap-3 mb-6 shrink-0">
                <Image src={afferpriceLogo} width={34} height={34} alt="Afferprice Logo" />
                <h1 className="text-xl font-semibold">Afferprice</h1>
            </Link>
            <div className="grid gap-3 flex-1 mb-3">
                {menus.map((menu, index) => (
                    <Link
                        key={index}
                        href={menu.url}
                        className={`${headerName === menu.label ? "bg-orange-500/25 text-orange-500" : ""} flex items-center gap-3 p-2 rounded-lg hover:bg-orange-500/25 hover:text-orange-500`}
                    >
                        {menu.icon}
                        <span className="truncate">{menu.label}</span>
                        {badgeCounts[menu.url] > 0 && (
                            <span className="ml-auto shrink-0 text-white bg-orange-600 h-5 min-w-5 p-1 text-[10px] font-medium flex items-center justify-center rounded-sm leading-4">
                                {badgeCounts[menu.url] > 99 ? "99+" : badgeCounts[menu.url]}
                            </span>
                        )}
                    </Link>
                ))}
                {/* เมนูแบบ Accordion — config ที่ accordionMenus ด้านบนของไฟล์ */}
                <UseCollapse
                    ghost
                    expandIconPosition="end"
                    defaultActiveKey={defaultOpenGroups}
                    className="text-base! [&_.ant-collapse-header]:p-2! [&_.ant-collapse-header]:items-center! [&_.ant-collapse-header]:rounded-lg! [&_.ant-collapse-header]:text-white! [&_.ant-collapse-header:hover]:bg-orange-500/25 [&_.ant-collapse-header:hover]:text-orange-500! [&_.ant-collapse-content-box]:py-0! [&_.ant-collapse-content-box]:pr-0! [&_.ant-collapse-content-box]:pl-4! [&_.ant-collapse-body]:py-2!"
                    items={accordionMenus.map((group) => ({
                        key: group.key,
                        label: (
                            <span className="flex items-center gap-3">
                                {group.icon}
                                <span className="truncate">{group.label}</span>
                            </span>
                        ),
                        children: (
                            <div className="grid gap-2 text-white">
                                {group.children.map((menu, index) => (
                                    <Link
                                        key={index}
                                        href={menu.url}
                                        className={`${activeSegment === menu.url.split("/")[2] ? "bg-orange-500/25 text-orange-500" : ""} flex items-center gap-3 p-2 truncate hover:bg-orange-500/25!  hover:text-orange-500 text-white! border-l rounded-r-lg`}
                                    >
                                        {menu.icon}
                                        <span className="truncate">{menu.label}</span>
                                    </Link>
                                ))}
                            </div>
                        ),
                    }))}
                />
            </div>
            <div className="border-t border-slate-500 pt-3 shrink-0">
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
                        <div className="grid min-w-0">
                            <p className="text-sm truncate">{adminName}</p>
                            <p className="text-xs text-slate-400 truncate">{adminRole}</p>
                        </div>
                    </div>
                </UsePopover>
            </div>
        </nav>
    );

    return (
        <div className="flex min-h-dvh">
            {/* Desktop sidebar (fixed) */}
            <aside className="hidden lg:block w-64 shrink-0">
                <div className="fixed top-0 left-0 w-64">{navContent}</div>
            </aside>

            {/* Mobile sidebar (slide-in drawer) */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
                    <div className="absolute top-0 left-0 max-w-[85vw]">
                        <button
                            onClick={() => setMobileNavOpen(false)}
                            className="absolute top-4 right-3 z-10 text-white/80 hover:text-white"
                            aria-label="ปิดเมนู"
                        >
                            <CloseOutlined className="text-lg!" />
                        </button>
                        {navContent}
                    </div>
                </div>
            )}

            <div className="flex-1 min-w-0">
                <header className="px-4 md:px-6 h-12 flex items-center justify-between bg-slate-100 dark:bg-slate-900 dark:border-b dark:border-slate-700">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setMobileNavOpen(true)}
                            className="lg:hidden flex items-center cursor-pointer hover:text-orange-500"
                            aria-label="เปิดเมนู"
                        >
                            <MenuOutlined className="text-lg!" />
                        </button>
                        <h2 className="text-base md:text-xl font-bold dark:text-slate-100 truncate">{headerName}</h2>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6 shrink-0">
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
                        <QuestionCircleOutlined className="text-lg! hidden md:inline" />
                    </div>
                </header>
                <div className="p-4 md:p-6">{children}</div>
            </div>
            <AdminNotificationDrawer open={openNoti} onClose={() => setOpenNoti(false)} />
        </div>
    );
}

export default AdminLayout;
