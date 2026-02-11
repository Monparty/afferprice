import UseButton from "../inputs/UseButton";
import { BankFilled, ClockCircleFilled, LockFilled, NotificationFilled, RiseOutlined } from "@ant-design/icons";

function CardProductBid() {
    return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm font-medium">เวลาที่เหลือ:</span>
                    <div className="flex items-center gap-2 text-orange-500">
                        <ClockCircleFilled />
                        <span className="text-sm font-bold uppercase tracking-wider">ปิดเร็วๆ นี้</span>
                    </div>
                </div>
                <div className="flex justify-between text-center gap-2">
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-black text-orange-500">04</span>
                        <span className="text-[10px] text-slate-400 uppercase">ชั่วโมง</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-black text-orange-500">21</span>
                        <span className="text-[10px] text-slate-400 uppercase">นาที</span>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg py-2">
                        <span className="block text-2xl font-black text-orange-500">38</span>
                        <span className="text-[10px] text-slate-400 uppercase">วินาที</span>
                    </div>
                </div>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">ราคาประมูลปัจจุบัน</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-4xl font-extrabold text-primary">฿498,750</h2>
                        <span className="text-emerald-600 text-sm font-bold flex items-center">
                            <RiseOutlined />
                            +฿17,500
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">ถึงราคาขั้นต่ำแล้ว • ผู้ประมูลรวม 24 ราย</p>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        <button className="py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors">
                            +฿3,500
                        </button>
                        <button className="py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors">
                            +฿17,500
                        </button>
                        <button className="py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors">
                            +฿35,000
                        </button>
                    </div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-bold">
                            ฿
                        </span>
                        <input
                            className="block w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-xl font-bold focus:border-accent-orange focus:ring-0 transition-all"
                            placeholder="516,250"
                            type="number"
                        />
                    </div>
                    {/* <InputNumber size="large" className="h-14" />
                                    <InputText size="large" className="h-14" /> */}
                    <UseButton
                        label="วางประมูลทันที"
                        wFull
                        size="large"
                        icon={NotificationFilled}
                        iconPlacement
                        className="h-12!"
                    />
                    <div className="flex flex-col gap-2 text-sm text-slate-400 text-center">
                        <span className="flex items-center justify-center gap-2">
                            <BankFilled className=" text-blue-500!" />
                            รับประกันสินค้าแท้ 100%
                        </span>
                        <span className="flex items-center justify-center gap-2">
                            <LockFilled className=" text-blue-500!" />
                            ชำระเงินปลอดภัยและมีระบบคุ้มครอง
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardProductBid;
