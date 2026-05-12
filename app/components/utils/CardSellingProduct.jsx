import UseButton from "@/app/components/inputs/UseButton";
import UseTag from "@/app/components/utils/UseTag";
import { FieldTimeOutlined, MoreOutlined, TeamOutlined } from "@ant-design/icons";
import Image from "next/image";
import imageNotFound from "../../../public/images/imageNotFound.png";
import UsePopover from "./UsePopover";
import Link from "next/link";

function getPopoverAction(value) {
    const { stateName, isBuyer, paymentStatus, id } = value;
    const isPaid = paymentStatus === "paid";
    const linkCls = "text-black! hover:bg-gray-100! p-1 rounded-sm text-sm";
    const textCls = "text-slate-500 text-sm p-1";

    if (["บันทึกร่าง", "รออนุมัติ", "ไม่อนุมัติ"].includes(stateName)) {
        return <Link href={`/user/add-product/${id}/edit`} className={linkCls}>แก้ไข</Link>;
    }
    if (stateName === "กำลังประมูล") {
        return <Link href={`/product/${id}`} className={linkCls}>ดูสินค้า</Link>;
    }
    if (isBuyer) {
        if (isPaid) return <span className={textCls}>รอจัดส่งสินค้า</span>;
        return <Link href={`/user/checkout/${id}`} className={linkCls}>ตรวจสอบ</Link>;
    }
    if (stateName === "มีผู้ชนะ") {
        if (isPaid) return <Link href={`/user/checkout/${id}`} className={linkCls}>ระบุข้อมูลการจัดส่ง</Link>;
        return <span className={textCls}>รอชำระเงิน</span>;
    }
    return null;
}

function CardSellingProduct({ value }) {
    const action = getPopoverAction(value);

    return (
        <div className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                    <UseTag label={value.stateName} color={value.stateColor} className="capitalize" />
                </div>
                <div className="absolute top-3 right-3 z-10">
                    <UsePopover
                        placement="bottomRight"
                        content={<div className="grid gap-1 w-30">{action}</div>}
                    >
                        <UseButton shape="circle" type="default" icon={MoreOutlined} />
                    </UsePopover>
                </div>
                <Image
                    src={value.images_url?.[0].url || imageNotFound}
                    alt={value.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    width={300}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-blue-500 font-bold line-clamp-1 mb-1">{value.title}</h3>
                <div className="flex flex-col items-baseline gap-1 mt-auto">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">ราคาปัจจุบัน</span>
                    <span className="text-primary font-black text-lg">฿{value.start_price?.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 mt-4 pt-4 border-t border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">ผู้ประมูล</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">เหลือเวลา</span>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <TeamOutlined />
                            <span className="text-sm font-bold text-blue-500">12 ราย</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-red-500">
                            <FieldTimeOutlined />
                            <span className="text-sm font-bold">{value.duration_days} วัน</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardSellingProduct;
