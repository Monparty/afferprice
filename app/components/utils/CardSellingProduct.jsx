"use client";
import UseButton from "@/app/components/inputs/UseButton";
import UseTag from "@/app/components/utils/UseTag";
import { FieldTimeOutlined, MoreOutlined, TeamOutlined } from "@ant-design/icons";

function CardSellingProduct() {
    return (
        <div className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all">
            <div className="relative aspect-video overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                    <UseTag label="Active" color="success" variant="solid" />
                </div>
                <div className="absolute top-3 right-3 z-10">
                    <UseButton shape="circle" type="default" icon={MoreOutlined} />
                </div>
                <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    data-alt="Luxury Rolex Submariner watch on dark background"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtuf8J0Pi8bPJVc2SqyiK31sXzD7D3ScxS5eePNyTso5Gd0YL3R0-9QE5OLdPODAF9VmnlltXfV_Pl1euLfDCSphOyrCSITde0xOP-cVdp5FW51T6pqK5G5nEqLzR6u58gcPFGIlYUlR9lOyA058SFLIJQ0ZVeWZqrA8GYrvz3vNnsKVPu1KGLaEy7XON5orZ-CIN0caZjITw-UT5Xh9uzL3vbe2XaqW5WhDzD9BmcnvbxAi9TegMulBSxHQmXu2rsEnBkWS6PCME"
                />
            </div>
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-navy font-bold line-clamp-1 mb-1">Rolex Submariner Date 126610LN</h3>
                <div className="flex flex-col items-baseline gap-1 mt-auto">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">ราคาปัจจุบัน</span>
                    <span className="text-primary font-black text-lg">฿450,000</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">ผู้ประมูล</span>
                        <div className="flex items-center gap-1">
                            <TeamOutlined />
                            <span className="text-sm font-bold text-navy">12 ราย</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">เหลือเวลา</span>
                        <div className="flex items-center gap-1 text-red-500">
                            <FieldTimeOutlined />
                            <span className="text-sm font-bold">02:45:10</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardSellingProduct;
