"use client";
import UseButton from "@/app/components/inputs/UseButton";
import { DeleteFilled, EditOutlined, EyeFilled } from "@ant-design/icons";
import UseTooltip from "@/app/components/utils/UseTooltip";
import Link from "next/link";
import UsePopconfirm from "@/app/components/utils/UsePopconfirm";

function BtnActionGroup({ recordId, setModalWatch, setValue, editRoute, handleDelete }) {
    return (
        <div className="flex gap-2 justify-center">
            <UseTooltip title="ดู">
                <UseButton
                    onClick={() => {
                        setModalWatch(true);
                        setValue("id", recordId);
                    }}
                    shape="circle"
                    className="bg-blue-500!"
                    icon={EyeFilled}
                />
            </UseTooltip>
            <UseTooltip title="แก้ไข">
                <Link href={`${editRoute}/${recordId}/edit`}>
                    <UseButton shape="circle" icon={EditOutlined} />
                </Link>
            </UseTooltip>
            <UseTooltip title="ลบ">
                <UsePopconfirm
                    onConfirm={() => handleDelete(recordId)}
                    title="ยืนยันการลบ"
                    description="ต้องการลบข้อมูลนี้ ?"
                >
                    <UseButton shape="circle" className="bg-red-500!" icon={DeleteFilled} />
                </UsePopconfirm>
            </UseTooltip>
        </div>
    );
}

export default BtnActionGroup;
