"use client";
import Link from "next/link";
import InputText from "../inputs/InputText";
import { BellFilled, SearchOutlined } from "@ant-design/icons";
import UseButton from "../inputs/UseButton";
import UseBadge from "../utils/UseBadge";
import UseAvatar from "../utils/UseAvatar";
import { useState } from "react";
import UseDrawer from "../utils/UseDrawer";

function AppHeader() {
    const linkStyle =
        "h-15 flex items-center border-b-2 transition-all border-transparent hover:border-b-2 hover:border-orange-500";

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
            <h1 className="flex-2 text-xl font-semibold">Afferprice</h1>
            <div className="flex items-center flex-8 pe-4">
                <div className="flex-2">
                    <InputText placeholder="ค้นหาสินค้าประมูล..." variant="underlined" icon={SearchOutlined} />
                </div>
                <div className="flex-5">
                    <ul className="flex justify-center gap-8 h-15">
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
                    <UseButton label="เข้าสู่ระบบ" onClick={() => alert()} />
                    <UseAvatar src={"https://picsum.photos/200"} />
                </div>
            </div>
            <UseDrawer onClose={onCloseDrawer} open={openDrawer} />
        </header>
    );
}

export default AppHeader;
