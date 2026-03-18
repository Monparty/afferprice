"use client";
import UseSegmented from "@/app/components/inputs/UseSegmented";
import CardProduct from "@/app/components/utils/CardProduct";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";

function Page() {
    const { control } = useForm();
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">สิ่งที่ฉันถูกใจ</h1>
                    <p className="text-slate-500 text-base font-normal">คุณมีสิ้นค่าที่ถูกใจทั้งหมด 8 รายการ</p>
                </div>
                <UseSegmented
                    control={control}
                    name="layout"
                    options={[
                        { value: "1", icon: <BarsOutlined /> },
                        { value: "2", icon: <AppstoreOutlined /> },
                    ]}
                />
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
        </>
    );
}

export default Page;
