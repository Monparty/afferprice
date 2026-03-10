"use client";
import InputText from "@/app/components/inputs/InputText";
import UseButton from "@/app/components/inputs/UseButton";
import UseTable from "@/app/components/utils/UseTable";
import { DeleteFilled, EditOutlined, EyeFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import UseTooltip from "@/app/components/utils/UseTooltip";
import Link from "next/link";
import { useState } from "react";
import UseModal from "@/app/components/utils/UseModal";
import Form from "./components/Form";
import { useForm } from "react-hook-form";

function Page() {
    const { handleSubmit, watch, control, setValue } = useForm({
        shouldUnregister: false,
    });
    const [modalUser, setModalUser] = useState(false);
    const dataSource = [
        {
            key: "1",
            id: "123",
            name: "suniti sukontaprapun",
            email: "test@test.com",
            role: "132",
            status: "1",
            create: "09/03/2569",
        },
    ];

    const columns = [
        {
            title: "ชื่อ",
            dataIndex: "name",
            key: "field",
        },
        {
            title: "อีเมล",
            dataIndex: "email",
            key: "field",
        },
        {
            title: "บทบาท",
            dataIndex: "role",
            key: "field",
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "field",
        },
        {
            title: "วันที่สร้าง",
            dataIndex: "create",
            key: "field",
        },
        {
            title: "จัดการ",
            dataIndex: "field",
            key: "field",
            width: 160,
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <UseTooltip title="ดู">
                        <UseButton
                            onClick={() => {
                                setModalUser(true);
                                setValue("id", record.id);
                            }}
                            shape="circle"
                            className="bg-blue-500!"
                            icon={EyeFilled}
                        />
                    </UseTooltip>
                    <UseTooltip title="แก้ไข">
                        <Link href={`/admin/users/${record.id}/edit`}>
                            <UseButton shape="circle" icon={EditOutlined} />
                        </Link>
                    </UseTooltip>
                    <UseTooltip title="ลบ">
                        <UseButton
                            onClick={() => alert(record.id)}
                            shape="circle"
                            className="bg-red-500!"
                            icon={DeleteFilled}
                        />
                    </UseTooltip>
                </div>
            ),
        },
    ];
    return (
        <main className="grid gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden p-4">
                <InputText
                    control={control}
                    name="search"
                    size="large"
                    icon={SearchOutlined}
                    placeholder="ค้นหาข้อมูล..."
                />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-navy-deep">การจัดการการประมูล</h3>
                    <div className="flex gap-2">
                        <Link href="/admin/users/create">
                            <UseButton label="เพิ่มข้อมูล" icon={PlusOutlined} />
                        </Link>
                    </div>
                </div>
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
            <UseModal
                title="ข้อมูลผู้ใช้"
                open={modalUser}
                onCancel={() => setModalUser(false)}
                onOk={() => alert("ok")}
            >
                <Form id={watch("id")} />
            </UseModal>
        </main>
    );
}

export default Page;
