"use client";
import UseButton from "@/app/components/inputs/UseButton";
import {
    DownloadOutlined,
    EyeFilled,
    FieldTimeOutlined,
    RiseOutlined,
    TrophyFilled,
    MoreOutlined,
} from "@ant-design/icons";
import UseTable from "@/app/components/utils/UseTable";
import UseImage from "@/app/components/utils/UseImage";
import UseTag from "@/app/components/utils/UseTag";
import UseSegmented from "@/app/components/utils/UseSegmented";

function Page() {
    const dataSource = [
        {
            key: "1",
            img: "https://picsum.photos/400/400",
            status: "1",
            offerPrice: 1000,
            currentPrice: 200,
            remainTime: "1 วัน 2 ชั่วโมง 14 นาที",
        },
        {
            key: "2",
            img: "https://picsum.photos/400/401",
            status: "2",
            offerPrice: 555666,
            currentPrice: 230,
            remainTime: "1 วัน 2 ชั่วโมง 14 นาที",
        },
        {
            key: "3",
            img: "https://picsum.photos/400/402",
            status: "3",
            offerPrice: 220,
            currentPrice: 210,
            remainTime: "1 วัน 2 ชั่วโมง 14 นาที",
        },
    ];

    const columns = [
        {
            title: "รายละเอียด",
            dataIndex: "img",
            key: "img",
            width: 120,
            align: "center",
            render: (_, record) => <UseImage width={60} height={60} alt="img 1" src={record.img} />,
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (_, record) => {
                return (
                    <>
                        {record.status === "1" && <UseTag label="คุณกำลังนำ" color="green" />}
                        {record.status === "2" && <UseTag label="ถูกประมูลแซง" color="volcano" />}
                        {record.status === "3" && <UseTag label="กำลังติดตาม" />}
                    </>
                );
            },
        },
        {
            title: "ราคาที่เสนอ",
            dataIndex: "offerPrice",
            key: "offerPrice",
            render: (_, record) => <div className="font-bold">฿ {record.offerPrice?.toLocaleString()}</div>,
        },
        {
            title: "ราคาปัจจุบัน",
            dataIndex: "currentPrice",
            key: "currentPrice",
            render: (_, record) => <div className="font-bold">฿ {record.currentPrice?.toLocaleString()}</div>,
        },
        {
            title: "เวลาคงเหลือ",
            dataIndex: "remainTime",
            key: "remainTime",
            render: (_, record) => (
                <>
                    <FieldTimeOutlined /> {record.remainTime}
                </>
            ),
        },
        {
            title: "จัดการ",
            align: "center",
            render: (_, record) => {
                return (
                    <>
                        {record.status === "1" && <UseButton shape="circle" icon={MoreOutlined} />}
                        {record.status === "2" && <UseButton label="ประมูลด่วน" />}
                        {record.status === "3" && <UseButton label="เริ่มประมูล" type="default" />}
                    </>
                );
            },
        },
    ];
    return (
        <main>
            <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
                        แดชบอร์ดผู้ใช้งาน
                    </h1>
                    <p className="text-slate-500 text-base font-normal">
                        ยินดีต้อนรับกลับมา, คุณอเล็กซ์ นี่คือสรุปภาพรวมการประมูลของคุณ
                    </p>
                </div>
                <UseButton label="ดาวน์โหลดรายงาน" icon={DownloadOutlined} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                            การประมูลที่กำลังร่วม
                        </p>
                        <RiseOutlined className="text-2xl text-green-500!" />
                    </div>
                    <p className="text-3xl font-bold leading-tight">12</p>
                    <div className="flex items-center gap-1">
                        <span className="text-accent-success text-xs font-bold">+2 วันนี้</span>
                        <span className="text-slate-400 text-xs">จากเมื่อวาน</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">สินค้าที่ชนะ</p>
                        <TrophyFilled className="text-2xl text-blue-500!" />
                    </div>
                    <p className="text-3xl font-bold leading-tight">48</p>
                    <div className="flex items-center gap-1">
                        <span className="text-accent-success text-xs font-bold">+1 สัปดาห์นี้</span>
                        <span className="text-slate-400 text-xs">มูลค่ารวม $12.4k</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">กำลังติดตาม</p>
                        <EyeFilled className="text-2xl text-orange-600!" />
                    </div>
                    <p className="text-3xl font-bold leading-tight">25</p>
                    <div className="flex items-center gap-1">
                        <span className="text-accent-success text-xs font-bold">+5 รายการใหม่</span>
                        <span className="text-slate-400 text-xs">กำลังจะสิ้นสุด</span>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold">รายการประมูลปัจจุบันของคุณ</h2>
                    <UseSegmented
                        options={[
                            { value: "1", label: "ทั้งหมด" },
                            { value: "2", label: "กำลังนำ" },
                            { value: "3", label: "ถูกแซง" },
                        ]}
                    />
                </div>
                <UseTable columns={columns} dataSource={dataSource} />
                <div className="p-4 bg-slate-50 flex justify-center">
                    <UseButton type="default" label="ดูประวัติการประมูลทั้งหมด" />
                </div>
            </div>
        </main>
    );
}

export default Page;
