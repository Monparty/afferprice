"use client";
import Link from "next/link";
import { useState } from "react";
import AppHeader from "./components/layout/AppHeader";
import AppFooter from "./components/layout/AppFooter";
import CardZoomImage from "./components/utils/CardZoomImage";
import UseButton from "./components/inputs/UseButton";
import {
    ArrowRightOutlined, FireOutlined,
    FormatPainterOutlined,
    GroupOutlined,
    LaptopOutlined,
    SketchOutlined
} from "@ant-design/icons";
import CardProduct from "./components/utils/CardProduct";
import UseTabs from "./components/utils/UseTabs";
import UseSegmented from "./components/utils/UseSegmented";

function Page() {
    const [showDev, setShowDev] = useState(false);

    const tabItems = [
        {
            key: "1",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <FireOutlined className="text-xl" />
                    มาแรง
                </div>
            ),
            children: "Content of Tab Pane 1",
        },
        {
            key: "2",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <LaptopOutlined className="text-xl" />
                    อิเล็กทรอนิกส์
                </div>
            ),
            children: "Content of Tab Pane 2",
        },
        {
            key: "3",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <FormatPainterOutlined className="text-xl" />
                    ศิลปะ
                </div>
            ),
            children: "Content of Tab Pane 3",
        },
        {
            key: "4",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <SketchOutlined className="text-xl" />
                    เครื่องประดับ
                </div>
            ),
            children: "Content of Tab Pane 3",
        },
        {
            key: "5",
            label: (
                <div className="flex flex-col justify-center items-center gap-1 text-sm px-3">
                    <GroupOutlined className="text-xl" />
                    พระเครื่อง
                </div>
            ),
            children: "Content of Tab Pane 3",
        },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <button
                onClick={() => setShowDev(!showDev)}
                className="h-fit w-fit bg-blue-400 p-4 fixed z-100 m-4 right-0 rounded-lg  text-white flex opacity-50 cursor-pointer"
            >
                Dev
            </button>
            <div className={`${showDev ? "block" : "hidden"}`}>
                <div className="h-fit w-fit bg-blue-400 p-4 fixed z-100 m-4 right-0 top-15 rounded-lg font-bold text-white flex gap-4">
                    <Link href="/product">product</Link>
                    <Link href="/user">user</Link>
                    <Link href="/add-product">add-product</Link>
                    <Link href="/checkout">checkout</Link>
                    <Link href="/payment">payment</Link>
                    <Link href="/order">order</Link>
                </div>
                <div className="h-fit w-fit bg-red-500 p-4 fixed z-100 m-4 right-0 top-30 rounded-lg font-bold text-white">
                    <div>สิ่งที่ต้องแก้ต่อ</div>
                    <ul className="ps-1">
                        <li>- refactor className</li>
                        <li>- ใช้ tag Link แทน a</li>
                        <li>- เพิ่ม Omise payment</li>
                        <li>- ทำหน้า login register</li>
                        <li>- ผูก react-hook-form กับ input</li>
                        <li>- logo link ได้</li>
                    </ul>
                </div>
            </div>
            <main>
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="flex size-2 rounded-full bg-red-500 animate-pulse"></span>
                            <h2 className="text-2xl font-bold tracking-tight">ประมูลสดตอนนี้</h2>
                        </div>
                        <a
                            className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"
                            href="#"
                        >
                            <UseButton label="ดูทั้งหมด" type="link" icon={ArrowRightOutlined} iconPlacement />
                        </a>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                        <CardZoomImage
                            backgroundImage={
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuCBFFj5qKrhsgZaW4AzQ_39biUd9UTvQhlvmqAV33C_Y_uNotow8H2jfrW8lPgYyNGh7ivKNr5iu2qyWYqaQczd9H4wahNqtKyBy1CSaRyXUfip3LgJJNAJn9vWYAoo0_F5YjaK_2a17lbG2urdICZowkJaJtMoZOTyZVC369t86-m--x1cp7NGuLwbOnYxGEbfw-p7iv22xVcUuyoaEJCUE3DZq7rTtKPkdoVlAOXpXg_0RM_eInAHek0pJAQ_7r265ZYWnEgcA3I"
                            }
                            title="นาฬิกาสุดหรู รุ่นซับมาริเนอร์ สีดำเงา"
                            price={450000}
                            bid={24}
                        />
                        <CardZoomImage
                            backgroundImage={
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuB50U5YwdcaSTPsjHY8QJ6UmOwP-HyNL04F4fg71X_tIm0o5fy5P8d8YKx8mM9myGAY1uLERkXnt164d405TM4OhAO7yqrOySDq-7UcgtRJH-FyT3_q2rChpwbuyHJmUveg10fUH0YqAeqwfHb_OFWxcTsPcsklNkX0NBYfPf0VAqrQXfM4Y1ZEirScuqq_p8viJRp38EG2VufZKAFzt03McNNlXvAclqYOMQClSR5XSs8vtT6SmaO8R9iIK5OomEtcXvcG4W_fog0"
                            }
                            title="รถคลาสสิก วินเทจ 1967 สภาพสมบูรณ์"
                            price={4900000}
                            bid={40}
                            state
                        />
                        <CardZoomImage
                            backgroundImage={
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuDpd19gnQ3xYspEtUu2cdv1jFZqlbdbgzFQyUz1OK4ju5e9RX4cfXUb5myAl2W4Pq3CtXt3613zIo8gLgRyvMYSR3NnUlZejzMYz79a7YJ-x0DCGWX1-R4U3ID_-x58Mq6hpDHKvO-oYGvM5D1MpAaO6YOuoPG4Xjr2EjSSc_CgXF0jsL3hHHwWXJYtMBDx8inJMGSRaGY3rYkn7cd0oIgWjPqhB9F5XdmmOEmkiPQu5EMGfcVztwu4Wn7NC_tqB_4knMoqtzCyp5k"
                            }
                            title="กล้องไรก้า M11 ไดจิตัล"
                            price={20000}
                            bid={40}
                            state
                        />
                    </div>
                </section>
                <UseTabs items={tabItems} size="large" />
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">การประมูลยอดนิยม</h2>
                        <UseSegmented />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CardProduct
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDOkV3_tMtPQoqrdr5RvWu1EOww1XkxtgwCGbFm1y2M9v-DAgwwt0zhKK26nDPNe2M2N8ItDy3odvDww1Hm1rxjIGkvitlqPqPD_K6xVZYKfgvwUAuJGYWUQu1fxPnWHx7bFcasneqHnjL-LNYkld-IoNU1NN4QYObUilZ4ByUwVEeE4u4e8-n_gO8HjRvDpwMkRAkLYmpXUzMKhAiaaDXZ5fPHX_h7nTmoR8dLArSWuoJqpWjDLIy69dnMsAjstO_iG5OiBoaO5uc"
                            time="02:45:12"
                            category="นาฬิกา"
                            name="โอเมก้า สปีดมาสเตอร์"
                            price={185000}
                            bid={12}
                            favorite
                        />
                        <CardProduct
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDpd19gnQ3xYspEtUu2cdv1jFZqlbdbgzFQyUz1OK4ju5e9RX4cfXUb5myAl2W4Pq3CtXt3613zIo8gLgRyvMYSR3NnUlZejzMYz79a7YJ-x0DCGWX1-R4U3ID_-x58Mq6hpDHKvO-oYGvM5D1MpAaO6YOuoPG4Xjr2EjSSc_CgXF0jsL3hHHwWXJYtMBDx8inJMGSRaGY3rYkn7cd0oIgWjPqhB9F5XdmmOEmkiPQu5EMGfcVztwu4Wn7NC_tqB_4knMoqtzCyp5k"
                            time="00:15:30"
                            category="อิเล็กทรอนิกส์"
                            name="แมคบุ๊ค โปร M3 Max 16 นิ้ว"
                            price={75000}
                            bid={45}
                            favorite
                        />
                        <CardProduct
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuA7KmVEY3Ikig6_SnKkn9VIe-5-7WZQxnSRyAKDWr2q8zwePOEqrg5KUNcv8Dm3GH-G1asbDktjckcBpUMOz-DT1xRIMAfkkUeymH6N2WdX_4FWVH5rRTwWXwF7IO--7vBSKDWKZ6Titq5aFiqjmhuQH4Ea8ZpMpnP6_IslFdi7QqfZs_JfgoXoW5oSjRCxFf_f8S554N6xz6dytK7fVQaBPcecHvvt8UaVnn02fONYylZq4cwm1dxGkrsOxN6pVHPl30IcT7qYLsA"
                            time="05:22:10"
                            category="อิเล็กทรอนิกส์"
                            name="กล้องไรก้า M11 ไดจิตัล"
                            price={240000}
                            bid={8}
                        />
                        <CardProduct
                            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAXlKlFNpWGuvM15RYs6LZYnoVBP30D9RMgG1cOLcwMJWK5Gku1uha-gS1_Vjyzm2Bp5awq4I8QKAJ2aJb75U24df_hql4aRxeMSSUerdjZ3oYFNQ5PR6wdWcFF8oKpe33K-1gubeT-Xu2xpyjoigaXQOMUqZ8ioZLLnfcFtFhB37HCE-KBxCj6vXdGXJOldG96bIKt0-Bf6YGYqWupvBG4b_g1AJXlVbf8HjTdU2G3WjME0kRaLhnJLuNZ5e9pcBTRnV31PXokZhk"
                            time="01:10:45"
                            category="ศิลปะ"
                            name="ภาพวาดสีน้ำมันแนวแอ็บสแตรกต์"
                            price={150000}
                            bid={31}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Page;
