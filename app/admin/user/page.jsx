"use client";
import InputText from "@/app/components/inputs/InputText";
import UseButton from "@/app/components/inputs/UseButton";
import UseTable from "@/app/components/utils/UseTable";
import { useForm } from "react-hook-form";
import { DeleteFilled, EditOutlined, EyeFilled, PlusOutlined, SearchOutlined } from "@ant-design/icons";

function Page() {
    const { handleSubmit, watch, control } = useForm({
        shouldUnregister: false,
    });
    const dataSource = [
        {
            key: "1",
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
            render: (_, record) => (
                <div className="flex gap-2">
                    <UseButton shape="circle" className="bg-blue-500!" icon={EyeFilled} />
                    <UseButton shape="circle" icon={EditOutlined} />
                    <UseButton shape="circle" className="bg-red-500!" icon={DeleteFilled} />
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
                        <UseButton label="เพิ่มข้อมูล" icon={PlusOutlined} />
                    </div>
                </div>
                <UseTable columns={columns} dataSource={dataSource} />
            </div>
        </main>
    );
}

export default Page;
