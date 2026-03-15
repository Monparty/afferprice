"use client";
import InputText from "@/app/components/inputs/InputText";
import UseButton from "@/app/components/inputs/UseButton";
import UseTable from "@/app/components/utils/UseTable";
import { DeleteFilled, EditOutlined, EyeFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import UseTooltip from "@/app/components/utils/UseTooltip";
import Link from "next/link";
import { useEffect, useState } from "react";
import UseModal from "@/app/components/utils/UseModal";
import Form from "./components/Form";
import { useForm } from "react-hook-form";
import { ROUTES } from "../constants/routes";
import { deleteAuthUser, getUsersFull } from "@/app/services/admin/users.service";
import { notifyError } from "@/app/providers/NotificationProvider";
import { formatDateTime } from "@/app/utils/dateUtils";
import UsePopconfirm from "@/app/components/utils/UsePopconfirm";

function Page() {
    const { control, setValue, getValues } = useForm();
    const id = getValues("id");
    const [modalWatch, setModalWatch] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const onGetUsersFull = async () => {
        const { data, error } = await getUsersFull();
        if (error) return notifyError(error);
        const formatData = data.map((item) => {
            return {
                ...item,
                fullName: `${item.first_name} ${item.last_name}`,
                createdAt: formatDateTime(item.created_at),
            };
        });
        setDataSource(formatData);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        onGetUsersFull();
    }, []);

    const handleDelete = async (id) => {
        await deleteAuthUser(id);
        setDataSource((prev) => prev.filter((item) => item.id !== id));
    };

    const columns = [
        {
            title: "ชื่อ",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "อีเมล",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "บทบาท",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "วันที่สร้าง",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: "จัดการ",
            dataIndex: "action",
            key: "action",
            width: 160,
            render: (_, record) => (
                <div className="flex gap-2 justify-center">
                    <UseTooltip title="ดู">
                        <UseButton
                            onClick={() => {
                                setModalWatch(true);
                                setValue("id", record.id);
                            }}
                            shape="circle"
                            className="bg-blue-500!"
                            icon={EyeFilled}
                        />
                    </UseTooltip>
                    <UseTooltip title="แก้ไข">
                        <Link href={`${ROUTES.ADMIN_USERS}/${record.id}/edit`}>
                            <UseButton shape="circle" icon={EditOutlined} />
                        </Link>
                    </UseTooltip>
                    <UseTooltip title="ลบ">
                        <UsePopconfirm
                            onConfirm={() => handleDelete(record.id)}
                            title="ยืนยันการลบ"
                            description="คุณแน่ใจใช่ไหมว่าต้องการลบข้อมูลนี้"
                        >
                            <UseButton shape="circle" className="bg-red-500!" icon={DeleteFilled} />
                        </UsePopconfirm>
                    </UseTooltip>
                </div>
            ),
        },
    ];

    return (
        <main className="grid gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden p-4">
                <InputText
                    control={control}
                    name="search"
                    size="large"
                    icon={SearchOutlined}
                    placeholder="ค้นหาข้อมูล..."
                />
            </div>
            <div className="flex justify-end">
                <Link href={`${ROUTES.ADMIN_USERS}/create`}>
                    <UseButton label="เพิ่มข้อมูล" icon={PlusOutlined} />
                </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
            <UseModal open={modalWatch} onCancel={() => setModalWatch(false)}>
                <Form mode="watch" id={id} />
            </UseModal>
        </main>
    );
}

export default Page;
