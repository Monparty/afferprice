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
import { notifyError, notifySuccess } from "@/app/providers/NotificationProvider";
import { formatDateTime } from "@/app/utils/dateUtils";
import UseTag from "@/app/components/utils/UseTag";
import BtnActionGroup from "../components/BtnActionGroup";
import { useColumnSearch } from "@/app/hooks/useColumnSearch";
import { deleteProduct, getProducts } from "@/app/services/admin/products.service";
import UseImage from "@/app/components/utils/UseImage";

function Page() {
    const { control, setValue, getValues } = useForm();
    const id = getValues("id");
    const route = ROUTES.ADMIN_PRODUCT;
    const [modalWatch, setModalWatch] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const { columnSearch } = useColumnSearch();

    const onGetProducts = async () => {
        const { data, error } = await getProducts();
        if (error) return notifyError(error);
        const formatData = data.map((item) => {
            return {
                ...item,
                createdAt: formatDateTime(item.created_at),
                imageUrl: item.images_url[0]?.url || null,
            };
        });
        setDataSource(formatData);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        onGetProducts();
    }, []);

    const handleDelete = async (id) => {
        const { error } = await deleteProduct(id);
        if (error) return notifyError(error);
        notifySuccess("ลบข้อมูลสำเร็จ");
        setDataSource((prev) => prev.filter((item) => item.id !== id));
    };

    const columns = [
        {
            title: "รูปภาพ",
            dataIndex: "imageUrl",
            key: "imageUrl",
            width: 120,
            align: "center",
            render: (_, record) => <UseImage width={60} height={60} alt="product thumbnail" src={record.imageUrl} />,
        },
        {
            title: "ชื่อสินค้า",
            dataIndex: "title",
            key: "title",
            ...columnSearch("title", control, setValue),
        },
        {
            title: "ราคาเริ่มต้น",
            dataIndex: "start_price",
            key: "start_price",
            sorter: (a, b) => a.start_price.localeCompare(b.start_price),
            render: (_, record) => <>{record.start_price?.toLocaleString()}</>,
        },
        {
            title: "ระยะเวลา",
            dataIndex: "duration_days",
            key: "duration_days",
            sorter: (a, b) => a.duration_days.localeCompare(b.duration_days),
            render: (_, record) => <>{record.duration_days} วัน</>,
        },
        {
            title: "สถานะสินค้า",
            dataIndex: "status",
            key: "status",
            render: (_, record) => (
                <UseTag
                    label={record.status}
                    variant="filled"
                    color={record.status === "draft" ? "" : null}
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
