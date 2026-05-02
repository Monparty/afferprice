"use client";
import {
    PlusOutlined,
    BarChartOutlined,
    UserOutlined,
    TagOutlined,
    HeartOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import UseButton from "../../../components/inputs/UseButton";
import Link from "next/link";
import UseModal from "../../../components/utils/UseModal";
import { useState } from "react";
import { usePathname } from "next/navigation";
import UserProfilesForm from "./UserProfilesForm";

const navItems = [
    { href: "/user", icon: BarChartOutlined, label: "แดชบอร์ด", exact: true },
    { href: "/user/selling", icon: TagOutlined, label: "สินค้าของฉัน" },
    { href: "/user/favorites", icon: HeartOutlined, label: "ถูกใจ" },
    { href: "/user/address", icon: EnvironmentOutlined, label: "ที่อยู่" },
];

function UserNavbar() {
    const [isOpenModalProfile, setIsOpenModalProfile] = useState(false);
    const pathname = usePathname();

    const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

    const linkBase =
        "shrink-0 flex flex-col items-center gap-1 min-w-16 px-3 py-2 rounded-lg transition-colors text-xs " +
        "md:flex-row md:min-w-0 md:gap-2 md:text-sm md:p-2 ";
    const linkIdle =
        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 bg-white dark:bg-zinc-800";
    const linkActiveStyle = "text-orange-600 bg-orange-50 dark:bg-orange-950";

    return (
        <>
            <nav
                className="
                flex overflow-x-auto gap-2
                md:grid md:overflow-visible md:gap-2 pb-0 md:pb-4
                p-3 md:p-4 rounded-lg
                bg-white dark:bg-zinc-800
                border border-slate-200 dark:border-zinc-700 shadow-sm 
            "
            >
                {/* Create product — full-width on desktop, compact on mobile */}
                <Link href="/user/add-product" className="shrink-0 md:w-full mb-1 md:mb-2">
                    <UseButton label="สร้างรายการ" icon={PlusOutlined} size="large" wFull />
                </Link>

                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${linkBase} ${isActive(item) ? linkActiveStyle : linkIdle}`}
                    >
                        <item.icon style={{ fontSize: 18 }} />
                        <span>{item.label}</span>
                    </Link>
                ))}

                {/* Profile — opens modal */}
                <button
                    onClick={() => setIsOpenModalProfile(true)}
                    className={`${linkBase} ${linkIdle} cursor-pointer`}
                >
                    <UserOutlined style={{ fontSize: 18 }} />
                    <span>โปรไฟล์</span>
                </button>
            </nav>

            <UseModal
                title="ข้อมูลโปรไฟล์ผู้ใช้"
                open={isOpenModalProfile}
                onCancel={() => setIsOpenModalProfile(false)}
                isShowCancel={false}
            >
                <UserProfilesForm setIsOpenModalProfile={setIsOpenModalProfile} />
            </UseModal>
        </>
    );
}

export default UserNavbar;
