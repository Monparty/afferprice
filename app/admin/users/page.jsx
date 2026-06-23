"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UseTable from "@/app/components/utils/UseTable";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import UseModal from "@/app/components/utils/UseModal";
import Form from "./components/Form";
import KycReviewModal from "./components/KycReviewModal";
import { useForm } from "react-hook-form";
import { ROUTES } from "../constants/routes";
import { deleteAuthUser, getUsersFull } from "@/app/services/admin/users.service";
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { formatDateTime } from "@/app/utils/dateUtils";
import UseTag from "@/app/components/utils/UseTag";
import BtnActionGroup from "../components/BtnActionGroup";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";

const KYC_TAG = {
    approved: { color: "green", label: "ยืนยันแล้ว" },
    pending: { color: "orange", label: "รอตรวจสอบ" },
    rejected: { color: "red", label: "ไม่ผ่าน" },
    unknown: { color: "default", label: "ยังไม่ยืนยัน" },
};

function Page() {
    const { control, setValue, getValues } = useForm();
    const id = getValues("id");
    const route = ROUTES.ADMIN_USERS;
    const [modalWatch, setModalWatch] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [kycModalOpen, setKycModalOpen] = useState(false);
    const [kycUserId, setKycUserId] = useState(null);
    const { columnSearch } = useColumnSearch();

    const onGetUsersFull = async () => {
        const { data, error } = await getUsersFull();
        if (error) return notifyError(error);
        const formatData = data.map((item) => {
            return {
                ...item,
                fullName: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "-",
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

    const handleOpenKyc = (userId) => {
        setKycUserId(userId);
        setKycModalOpen(true);
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
            title: "KYC",
            dataIndex: "is_kyc",
            key: "is_kyc",
            render: (_, record) => {
                const tag = KYC_TAG[record.is_kyc] ?? KYC_TAG.unknown;
                return <UseTag label={tag.label} color={tag.color} variant="filled" />;
            },
            sorter: (a, b) => {
                const order = { pending: 0, rejected: 1, unknown: 2, approved: 3 };
                return (order[a.is_kyc] ?? 4) - (order[b.is_kyc] ?? 4);
            },
            defaultSortOrder: "ascend",
        },
        {
            title: "วันที่สร้าง",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: (a, b) => a.createdAt?.localeCompare(b.createdAt),
        },
        {
            title: "จัดการ",
            dataIndex: "action",
            key: "action",
            width: 200,
            render: (_, record) => (
                <BtnActionGroup
                    recordId={record.id}
                    setModalWatch={setModalWatch}
                    setValue={setValue}
                    editRoute={route}
                    handleDelete={handleDelete}
                    onViewKyc={handleOpenKyc}
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
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
            <UseModal open={modalWatch} onCancel={() => setModalWatch(false)}>
                <Form mode="watch" id={id} />
            </UseModal>
            <KycReviewModal
                open={kycModalOpen}
                userId={kycUserId}
                onClose={() => setKycModalOpen(false)}
                onSuccess={onGetUsersFull}
            />
        </main>
    );
}

export default Page;
