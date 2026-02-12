"use client";
import Link from "next/link";
import InputText from "../inputs/InputText";
import { BellFilled, SearchOutlined } from "@ant-design/icons";
import UseButton from "../inputs/UseButton";
import UseBadge from "../utils/UseBadge";
import UseAvatar from "../utils/UseAvatar";
import { useState } from "react";
import UseDrawer from "../utils/UseDrawer";
import { useForm } from "react-hook-form";
import afferpriceLogo from "../../../public/images/afferpriceLogo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";

function AppHeader() {
    const { control } = useForm();
    const pathname = usePathname();
    const linkStyle =
        "h-15 flex items-center border-b-3 transition-all border-transparent hover:border-b-3 hover:text-orange-600 hover:border-orange-600";
    console.log("pathname", pathname)
    // Drawer
    const [openDrawer, setOpenDrawer] = useState(false);
    const showDrawer = () => {
        setOpenDrawer(true);
    };
    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };
    

    return (
        <header className="h-15 flex items-center ps-10 shadow-sm">
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
                        <li>
                            <Link href="/" className={linkStyle}>
                                การประมูล
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className={linkStyle}>
                                หมวดหมู่
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className={linkStyle}>
                                ลงขาย
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className={linkStyle}>
                                รายการโปรด
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex-2 flex gap-4 justify-end">
                    <UseBadge dot>
                        <UseButton onClick={() => showDrawer()} icon={BellFilled} />
                    </UseBadge>
                    <Link href="/login">
                        <UseButton label="เข้าสู่ระบบ" />
                    </Link>

                    <UseAvatar src={"https://picsum.photos/30/30"} />
                </div>
            </div>
            <UseDrawer onClose={onCloseDrawer} open={openDrawer} />
        </header>
    );
}

export default AppHeader;
