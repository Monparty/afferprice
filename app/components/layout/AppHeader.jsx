"use client";
import Link from "next/link";
import InputText from "../inputs/InputText";
import { BellFilled, LogoutOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import UseButton from "../inputs/UseButton";
import UseBadge from "../utils/UseBadge";
import UseAvatar from "../utils/UseAvatar";
import { useEffect, useRef, useState } from "react";
import UseDrawer from "../utils/UseDrawer";
import { useForm } from "react-hook-form";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import UsePopover from "../utils/UsePopover";
import { logout, subscribeAuth } from "../../../app/services/auth.service";
import { getProfileByUserId } from "@/app/services/profile.service";
import { notifyError } from "@/app/providers/NotificationProvider";

function AppHeader() {
    const { control } = useForm();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const linkStyle =
        "h-15 flex items-center transition-all border-transparent border-b-3 hover:border-b-3 hover:text-orange-600 hover:border-orange-600";
    const linkStyleActive = "h-15 flex items-center transition-all border-b-3 text-orange-600 border-orange-600";
    const menus = [
        {
            url: "/",
            label: "หน้าแรก",
        },
        {
            url: "/categories",
            label: "หมวดหมู่",
        },
        {
            url: "/auction",
            label: "การประมูล",
        },
    ];

    const mapPath = menus.find((item) => item.url.split("/")[1] === pathname.split("/")[1])?.label || "";

    // Drawer
    const [openDrawer, setOpenDrawer] = useState(false);
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };

    // logout
    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    useEffect(() => {
        // ฟัง login / logout
        const unsubscribe = subscribeAuth(setUser);
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            const { data, error } = await getProfileByUserId(user.id);
            if (error) return notifyError(error);
            setProfile(data);
        };
        fetchProfile();
    }, [user]);

    // controlNavbar
    const [show, setShow] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const threshold = 50;
                    if (currentScrollY <= threshold) {
                        setShow(true);
                    } else if (currentScrollY > lastScrollY.current) {
                        setShow(false);
                    } else {
                        setShow(true);
                    }
                    lastScrollY.current = currentScrollY;
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="h-15">
            <div
                className={`
                    fixed top-0 z-50 w-full flex items-center ps-10 bg-white shadow-sm
                    transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
                `}
            >
                <Link href="/" className="flex-2 flex items-center gap-3">
                    <Image src={afferpriceLogo} width={32} height={32} alt="Afferprice Logo" />
                    <h1 className="text-xl font-semibold">Afferprice</h1>
                </Link>
                <div className="flex items-center flex-8 pe-4">
                    <div className="flex-2">
                        <InputText
                            control={control}
                            name="search"
                            placeholder="ค้นหาสินค้าประมูล..."
                            variant="underlined"
                            icon={SearchOutlined}
                        />
                    </div>
                    <div className="flex-5">
                        <ul className="flex justify-center gap-8 h-15 b text-gray-700">
                            {menus.map((menu, index) => (
                                <li key={index}>
                                    <Link
                                        href={menu.url}
                                        className={`${mapPath === menu.label ? linkStyleActive : linkStyle}`}
                                    >
                                        {menu.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-2 flex gap-4 justify-end items-center">
                        {!user ? (
                            <Link href="/login">
                                <UseButton label="เข้าสู่ระบบ" />
                            </Link>
                        ) : (
                            <>
                                <span>สวัสดีคุณ {profile?.first_name ?? user.email}</span>
                                <UseBadge dot>
                                    <UseButton onClick={() => showDrawer()} icon={BellFilled} />
                                </UseBadge>
                                <UsePopover
                                    placement="bottomRight"
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
                                    <UseAvatar src={"https://picsum.photos/30/30"} />
                                </UsePopover>
                            </>
                        )}
                    </div>
                </div>
                <UseDrawer onClose={onCloseDrawer} open={openDrawer} />
            </div>
        </header>
    );
}

export default AppHeader;
