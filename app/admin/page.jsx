"use client";
import UseButton from "../components/inputs/UseButton";
import UseImage from "../components/utils/UseImage";
import UseTable from "../components/utils/UseTable";
import UseTag from "../components/utils/UseTag";
import { ContainerOutlined, NotificationOutlined } from "@ant-design/icons";

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
            title: "สินค้า",
            dataIndex: "img",
            key: "img",
            width: 120,
            align: "center",
            render: (_, record) => <UseImage width={60} height={60} alt="img 1" src={record.img} />,
        },
        {
            title: "ชื่อผู้ขาย",
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
            title: "ราคาประมูลล่าสุด",
            dataIndex: "offerPrice",
            key: "offerPrice",
            render: (_, record) => <div className="font-bold">฿{record.offerPrice?.toLocaleString()}</div>,
        },
        {
            title: "เวลาที่เหลือ",
            dataIndex: "currentPrice",
            key: "currentPrice",
            render: (_, record) => <div className="font-bold">฿{record.currentPrice?.toLocaleString()}</div>,
        },
        {
            title: "สถานะ",
            dataIndex: "currentPrice",
            key: "currentPrice",
            render: (_, record) => <div className="font-bold">฿{record.currentPrice?.toLocaleString()}</div>,
        },
        {
            title: "จัดการ",
            dataIndex: "currentPrice",
            key: "currentPrice",
            render: (_, record) => <div className="font-bold">฿{record.currentPrice?.toLocaleString()}</div>,
        },
    ];
    return (
        <>
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 text-sm font-medium">รายได้ทั้งหมด</p>
                            <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                +12.5%
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-black tracking-tight">฿1,250,000</h3>
                        <div className="mt-2 h-10 w-full">
                            <svg className="w-full h-full" preserveaspectratio="none" viewbox="0 0 100 40">
                                <path
                                    d="M0 40 L10 30 L20 35 L30 20 L40 25 L50 10 L60 15 L70 5 L80 12 L90 8 L100 15"
                                    fill="none"
                                    stroke="#f27f0d"
                                    stroke-width="2"
                                    vector-effect="non-scaling-stroke"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 text-sm font-medium">การประมูลที่ใช้งานอยู่</p>
                            <NotificationOutlined />
                        </div>
                        <h3 className="text-2xl font-bold text-black tracking-tight">452</h3>
                        <p className="text-slate-400 text-xs">อัปเดตเมื่อ 5 นาทีที่แล้ว</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 text-sm font-medium">รอการอนุมัติ</p>
                            <ContainerOutlined />
                        </div>
                        <h3 className="text-2xl font-bold text-black tracking-tight text-amber-500">28</h3>
                        <p className="text-slate-400 text-xs">ต้องดำเนินการเร่งด่วน</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 text-sm font-medium">ผู้ใช้งานใหม่</p>
                            <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                +15%
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-black tracking-tight">124</h3>
                        <p className="text-slate-400 text-xs">ใน 7 วันล่าสุด</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-black">การจัดการการประมูล</h3>
                        <div className="flex gap-2">
                            <UseButton label="กรองข้อมูล" type="default" />
                            <UseButton label="เพิ่มการประมูลใหม่" />
                        </div>
                    </div>
                    <UseTable columns={columns} dataSource={dataSource} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h4 className="font-bold text-black mb-4">กิจกรรมล่าสุด</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                                <div>
                                    <p className="text-sm text-black">
                                        <span className="font-bold">คุณพงษ์เทพ</span> ได้ประมูล{" "}
                                        <span className="text-primary font-bold">Luxury Silver Watch</span> ในราคา
                                        ฿45,500
                                    </p>
                                    <p className="text-xs text-slate-400">2 นาทีที่ผ่านมา</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <p className="text-sm text-black">
                                        อนุมัติผู้ใช้งานใหม่ <span className="font-bold">กมลวรรณ ทรัพย์มาก</span>{" "}
                                        เข้าสู่ระบบ
                                    </p>
                                    <p className="text-xs text-slate-400">15 นาทีที่ผ่านมา</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                <div>
                                    <p className="text-sm text-black">
                                        ได้รับคำขอถอนเงินจำนวน <span className="font-bold">฿12,000</span> จาก{" "}
                                        <span className="font-bold">วิชัย สมบัติ</span>
                                    </p>
                                    <p className="text-xs text-slate-400">40 นาทีที่ผ่านมา</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-black p-6 rounded-xl shadow-lg relative overflow-hidden group">
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-xl mb-2">สรุปรายงานประจำเดือน</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    ข้อมูลการวิเคราะห์การเติบโตของแพลตฟอร์มในเดือนนี้ พร้อมดาวน์โหลดเป็น PDF หรือ CSV
                                    เพื่อการนำเสนอ
                                </p>
                            </div>
                            <UseButton label="ดาวน์โหลดรายงาน" size="large" wFull />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;
