import { Drawer } from "antd";
import UseButton from "../inputs/UseButton";
import { ArrowRightOutlined } from "@ant-design/icons";
import CardDrawer from "./CardDrawer";

function UseDrawer({ onClose, open, loading = false, onRead }) {
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
                <div className="bg-white flex justify-center">
                    <UseButton label="ดูประวัติกิจกรรมทั้งหมด" icon={ArrowRightOutlined} type="default" iconPlacement />
                </div>
            }
        >
            <div>
                <div className="flex gap-2">
                    <UseButton shape="round" label="ทั้งหมด" />
                    <UseButton shape="round" label="การเสนอราคา" type={null} />
                    <UseButton shape="round" label="คำเตือน" type={null} />
                </div>
                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">
                    <CardDrawer open={open} onClose={onClose} onRead={onRead} />
                </div>
            </div>
        </Drawer>
    );
}

export default UseDrawer;
