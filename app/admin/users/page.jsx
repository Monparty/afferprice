"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UseTable from "@/app/components/utils/UseTable";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import UseModal from "@/app/components/utils/UseModal";
import Form from "./components/Form";
import { useForm } from "react-hook-form";
import { ROUTES } from "../constants/routes";
import { deleteAuthUser, getUsersFull } from "@/app/services/admin/users.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { formatDateTime } from "@/app/utils/dateUtils";
import UseTag from "@/app/components/utils/UseTag";
import BtnActionGroup from "../components/BtnActionGroup";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";

function Page() {
    const { control, setValue, getValues } = useForm();
    const id = getValues("id");
    const route = ROUTES.ADMIN_USERS;
    const [modalWatch, setModalWatch] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

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
        notifySuccess("ลบข้อมูลสำเร็จ");
        setDataSource((prev) => prev.filter((item) => item.id !== id));
    };

    const columns = [
        {
            title: "ชื่อ",
            dataIndex: "fullName",
            key: "fullName",
            ...columnSearch("fullName", control, setValue),
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
            render: (_, record) => (
                <UseTag
                    label={record.role}
                    variant="filled"
                    color={record.role === "user" ? "blue" : "magenta"}
                    className="capitalize"
                />
            ),
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <UseTag
                    label={record.status}
                    variant="filled"
                    color={record.status === "active" ? "green" : null}
                    className="capitalize"
                />
            ),
        },
        {
            title: "วันที่สร้าง",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
            defaultSortOrder: "descend",
        },
        {
            title: "จัดการ",
            dataIndex: "action",
            key: "action",
            width: 160,
            render: (_, record) => (
                <BtnActionGroup
                    recordId={record.id}
                    setModalWatch={setModalWatch}
                    setValue={setValue}
                    editRoute={route}
                    handleDelete={handleDelete}
                />
            ),
        },
    ];

    return (
        <main className="grid gap-4">
            <div className="flex justify-end">
                <Link href={`${route}/create`}>
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
