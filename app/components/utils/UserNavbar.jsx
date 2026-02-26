"use client";
import { PlusOutlined, BarChartOutlined, UserOutlined, TagOutlined } from "@ant-design/icons";
import UseButton from "../../../app/components/inputs/UseButton";
import Link from "next/link";
import UseModal from "./UseModal";
import { useState } from "react";

function UserNavbar() {
    const [isOpenModalProfile, setIsOpenModalProfile] = useState(false);
    return (
        <>
            <nav className="w-full grid gap-4 p-4 rounded-lg bg-white border shadow-lg  border-slate-200">
                <Link href="/user/add-product">
                    <UseButton label="สร้างรายการสินค้า" icon={PlusOutlined} size="large" wFull />
                </Link>
                <Link href="/user" className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-100">
                    <UseButton shape="circle" icon={BarChartOutlined} />
                    แดชบอร์ดผู้ใช้งาน
                </Link>
                <Link
                    href="/user/selling"
                    className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-100"
                >
                    <UseButton shape="circle" icon={TagOutlined} />
                    รายการสินค้าของคุณ
                </Link>
                <div
                    className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsOpenModalProfile(true)}
                >
                    <UseButton shape="circle" icon={UserOutlined} />
                    โปรไฟล์ผู้ใช้
                </div>
            </nav>
            <UseModal
                title="ข้อมูลโปรไฟล์ผู้ใช้"
                open={isOpenModalProfile}
                onCancel={() => setIsOpenModalProfile(false)}
                onOk={() => alert("ok")}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </UseModal>
        </>
    );
}

export default UserNavbar;
