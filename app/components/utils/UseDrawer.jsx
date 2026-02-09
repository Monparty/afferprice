import { Drawer } from "antd";
import UseButton from "../inputs/UseButton";
import { ArrowRightOutlined, EyeOutlined, FieldTimeOutlined, FrownOutlined, SmileOutlined } from "@ant-design/icons";

function UseDrawer({ onClose, open, loading = false }) {
    return (
        <Drawer
            title={
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-primary tracking-tight">การแจ้งเตือนกิจกรรม</h2>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-100">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        เรียลไทม์
                    </span>
                </div>
            }
            closable={{ "aria-label": "Close Button", placement: "end" }}
            onClose={onClose}
            open={open}
            loading={loading}
            classNames={{
                body: "p-4!",
                header: "p-4!",
                footer: "p-4!",
            }}
            size={500}
            footer={
                <div className="bg-white">
                    <UseButton label="ดูประวัติกิจกรรมทั้งหมด" icon={ArrowRightOutlined} type="link" iconPlacement />
                </div>
            }
        >
            <div>
                <div className="flex gap-2 bg-slate-50/50">
                    <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-sm bg-orange-500">
                        ทั้งหมด
                    </button>
                    <button className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-all">
                        การเสนอราคา
                    </button>
                    <button className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-all">
                        คำเตือน
                    </button>
                    <div className="ml-auto flex items-center">
                        <button className="text-xs text-slate-400 hover:text-primary transition-colors">
                            อ่านแล้วทั้งหมด
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
                    <div className="p-4 rounded-xl bg-white border border-red-100 hover:border-red-200 hover:shadow-md transition-all group">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                <FrownOutlined style={{ fontSize: "20px" }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-900 font-bold text-sm">คุณถูกประมูลแซงแล้ว!</h3>
                                    <span className="text-[10px] text-slate-400 font-medium">1 นาทีที่แล้ว</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                                    มีผู้เสนอราคาสูงกว่าคุณในรายการ{" "}
                                    <span className="text-slate-900 font-medium">Vintage Rolex Oyster Perpetual</span>
                                    <br />
                                    ราคาปัจจุบัน: <span className="text-slate-900 font-bold">฿45,500</span>
                                </p>
                                <UseButton size="large" label="ประมูลใหม่ทันทีเป็น ฿47,000" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                                <FieldTimeOutlined style={{ fontSize: "20px" }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-900 font-bold text-sm">การประมูลกำลังจะสิ้นสุด!</h3>
                                    <span className="text-[10px] text-slate-400 font-medium">3 นาทีที่แล้ว</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed mb-3">
                                    รายการ{" "}
                                    <span className="text-slate-900 font-medium">First Edition Charizard Card</span>{" "}
                                    กำลังจะจบลงในอีก <span className="text-amber-600 font-bold">2น. 45ว.</span>
                                </p>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[15%]"></div>
                                </div>
                                <UseButton size="large" label="ดูสินค้า" type="outlined" />
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-green-100 hover:border-green-200 hover:shadow-md transition-all">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                                <SmileOutlined style={{ fontSize: "20px" }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-900 font-bold text-sm">ยินดีด้วย! คุณชนะการประมูล</h3>
                                    <span className="text-[10px] text-slate-400 font-medium">2 ชม. ที่แล้ว</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                    คุณชนะการประมูลสำหรับรายการ{" "}
                                    <span className="text-slate-900 font-medium">Professional Leica M10 Body</span>
                                </p>
                                <p className="text-[11px] text-green-600 mt-2 font-bold">ราคาที่ชนะ: ฿185,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 opacity-80">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                                <EyeOutlined style={{ fontSize: "20px" }} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-700 font-semibold text-sm">ความสนใจใหม่</h3>
                                    <span className="text-[10px] text-slate-400 font-medium">5 ชม. ที่แล้ว</span>
                                </div>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    มีคนเพิ่ม <span className="text-slate-700">Antique Writing Desk</span>{" "}
                                    ของคุณลงในรายการที่เฝ้าดูเพิ่มขึ้น 12 คน
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}

export default UseDrawer;
