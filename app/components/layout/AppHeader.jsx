"use client";
import Link from "next/link";
import InputText from "../inputs/InputText";
import {
    BellFilled,
    LogoutOutlined,
    MenuOutlined,
    CloseOutlined,
    SearchOutlined,
    SettingOutlined,
    UserOutlined,
    SunOutlined,
    MoonOutlined,
} from "@ant-design/icons";
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
import { getProfileById } from "@/app/services/profile.service";
import { searchProducts } from "@/app/services/products.service";
import { getUnreadCount } from "@/app/services/notifications.service";
import { getSellerProducts } from "@/app/services/products.service";
import { notifyError } from "@/app/providers/NotificationProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import UseAutoComplete from "../inputs/UseAutoComplete";
import { useDispatch } from "react-redux";
import { clearUser } from "@/app/features/user/userSlice";

function AppHeader() {
    const { control } = useForm();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const router = useRouter();
    const { isDark, toggleTheme } = useTheme();
    const dispatch = useDispatch();

    const fetchProductOptions = async (text) => {
        const { data } = await searchProducts(text);
        return (data || []).map((p) => ({
            value: p.title,
            id: p.id,
            label: (
                <div className="flex items-center gap-2">
                    {p.images_url?.[0]?.url ? (
                        <img src={p.images_url[0]?.url} className="w-8 h-8 object-cover rounded shrink-0" />
                    ) : (
                        <div className="w-8 h-8 rounded bg-slate-100 shrink-0" />
                    )}
                    <span className="truncate flex-1 text-sm">{p.title}</span>
                    <span className="text-orange-600 text-xs shrink-0">฿{p.start_price?.toLocaleString()}</span>
                </div>
            ),
        }));
    };

    const linkStyle =
        "h-15 flex items-center transition-all border-transparent border-b-3 hover:border-b-3 hover:text-orange-600 hover:border-orange-600";
    const linkStyleActive = "h-15 flex items-center transition-all border-b-3 text-orange-600 border-orange-600";
    const menus = [
        { url: "/", label: "หน้าแรก" },
        { url: "/categories", label: "หมวดหมู่" },
        { url: "/auction", label: "การประมูล" },
        { url: "/user/favorites", label: "สิ่งที่ถูกใจ" },
        { url: "/user/add-product", label: "สร้างรายการ" },
    ];

    const mapPath =
        menus.find((item) => (item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)))?.label || "";

    const [unreadCount, setUnreadCount] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false);

    const fetchUnreadCount = async () => {
        const [{ count: notifCount }, { data: products }] = await Promise.all([getUnreadCount(), getSellerProducts()]);
        const rejectedCount = (products ?? []).filter((p) => p.state === "rejected").length;
        setUnreadCount((notifCount ?? 0) + rejectedCount);
    };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        dispatch(clearUser());
        router.push("/");
    };

    useEffect(() => {
        const unsubscribe = subscribeAuth(setUser);
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            const { data, error } = await getProfileById(user.id);
            if (error) return notifyError(error);
            setProfile(data);
        };
        fetchProfile();
        fetchUnreadCount();
    }, [user]);

    // hide header on scroll down
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

    // close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const DarkModeToggle = () => (
        <button
            onClick={toggleTheme}
            className="size-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title={isDark ? "สลับโหมดสว่าง" : "สลับโหมดมืด"}
        >
            {isDark ? <SunOutlined style={{ fontSize: 18 }} /> : <MoonOutlined style={{ fontSize: 18 }} />}
        </button>
    );

    return (
        <header className="h-15">
            {/* Main bar */}
            <div
                className={`
                    fixed top-0 z-50 w-full flex items-center px-4 md:ps-10 gap-3
                    bg-white dark:bg-zinc-900 shadow-sm dark:shadow-zinc-800
                    transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
                `}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <Image src={afferpriceLogo} width={32} height={32} alt="Afferprice Logo" />
                    <h1 className="text-xl font-semibold dark:text-white hidden sm:block">Afferprice</h1>
                </Link>

                {/* Desktop search + nav */}
                <div className="hidden md:flex items-center flex-1 gap-8 justify-end pr-8">
                    <div className="w-52">
                        <UseAutoComplete
                            control={control}
                            name="search"
                            placeholder="ค้นหาสินค้าประมูล..."
                            variant="underlined"
                            icon={SearchOutlined}
                            fetchOptions={fetchProductOptions}
                            onSelectOption={(_, option) => router.push(`/product/${option.id}`)}
                            popupWidth={320}
                        />
                    </div>
                    <ul className="flex gap-6 h-15 text-gray-700 dark:text-gray-300">
                        {menus.map((menu, index) => (
                            <li key={index}>
                                <Link href={menu.url} className={mapPath === menu.label ? linkStyleActive : linkStyle}>
                                    {menu.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 ms-auto">
                    {/* User actions */}
                    {!user ? (
                        <div className="flex gap-4 items-center">
                            <DarkModeToggle />
                            <Link href="/login" className="hidden sm:block">
                                <UseButton label="เข้าสู่ระบบ" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <DarkModeToggle />
                            <UseBadge count={unreadCount}>
                                <UseButton onClick={() => setOpenDrawer(true)} icon={BellFilled} />
                            </UseBadge>
                            <UsePopover
                                placement="bottomRight"
                                content={
                                    <div className="grid gap-2 w-46">
                                        {profile?.role === "admin" && (
                                            <Link href="/admin" target="_blank">
                                                <UseButton
                                                    label="Admin"
                                                    className="justify-start! h-10!"
                                                    type="text"
                                                    icon={SettingOutlined}
                                                    wFull
                                                />
                                            </Link>
                                        )}
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
                                            onClick={handleLogout}
                                        />
                                    </div>
                                }
                            >
                                <UseAvatar src={profile?.profile_image || "https://picsum.photos/30/30"} />
                            </UsePopover>
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden size-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                        {mobileMenuOpen ? (
                            <CloseOutlined style={{ fontSize: 18 }} />
                        ) : (
                            <MenuOutlined style={{ fontSize: 18 }} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-15 left-0 right-0 z-40 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-700 shadow-lg px-4 py-4 space-y-4">
                    <InputText
                        control={control}
                        name="search_mobile"
                        placeholder="ค้นหาสินค้าประมูล..."
                        variant="underlined"
                        icon={SearchOutlined}
                    />
                    <ul className="space-y-1">
                        {menus.map((menu, index) => (
                            <li key={index}>
                                <Link
                                    href={menu.url}
                                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        mapPath === menu.label
                                            ? "text-orange-600 bg-orange-50 dark:bg-orange-950"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                    }`}
                                >
                                    {menu.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {!user && (
                        <Link href="/login">
                            <UseButton label="เข้าสู่ระบบ" wFull />
                        </Link>
                    )}
                </div>
            )}

            <UseDrawer onClose={() => setOpenDrawer(false)} open={openDrawer} onRead={fetchUnreadCount} />
        </header>
    );
}

export default AppHeader;
