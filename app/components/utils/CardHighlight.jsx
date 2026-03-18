import { FieldTimeOutlined } from "@ant-design/icons";
import Image from "next/image";
import UseButton from "../inputs/UseButton";
import UseTag from "./UseTag";

function CardHighlight() {
    return (
        <div className="group bg-white dark::bg-blue-500/20 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-4/3 overflow-hidden">
                <Image
                    src="https://picsum.photos/200/300"
                    alt="img"
                    width={300}
                    height={200}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 dark::bgbg-blue-500/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <FieldTimeOutlined />
                    <span className="text-xs font-bold text-black dark::text-white">02:14:55</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    <UseTag label="HOT DEAL" color="red" variant="solid" />
                </div>
            </div>
            <div className="p-5">
                <p className="text-xs text-primary font-bold mb-1 uppercase tracking-tight">Electronics</p>
                <h3 className="font-bold text-black dark::text-slate-100 text-lg line-clamp-1 mb-3">
                    Minimalist Smart Watch Series 7
                </h3>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs mb-1 text-black/40 dark::text-white/40 uppercase">ราคาปัจจุบัน</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs mb-1 text-black/40 dark::text-white/40">12 บิด</p>
                    </div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-xl font-bold text-black dark::text-slate-100">฿12,400</p>
                    </div>
                    <div className="text-right">
                        <UseButton label="ประมูล" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardHighlight;
