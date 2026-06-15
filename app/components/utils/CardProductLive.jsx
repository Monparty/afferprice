import Image from "next/image";
import UseTag from "./UseTag";
import {
    FieldTimeOutlined,
    FireFilled,
    HeartFilled,
    HeartOutlined,
    RiseOutlined,
    ThunderboltFilled,
} from "@ant-design/icons";
import UseButton from "../inputs/UseButton";
import UseAvatarGroup from "./UseAvatarGroup";
import { useRouter } from "next/navigation";
import { useRealtimePrice } from "@/app/hooks/useRealtimePrice";

function CardProductLive({ id, state = 1, src, productName, price = 2000, favorite = false, items = [], desc, time }) {
    // ใช้ที่ /auction
    const router = useRouter();
    const livePrice = useRealtimePrice(id, price);
    const priceBid = livePrice + 500;
    const countItems = items.length;
    const dataConfig = {
        1: {
            bg: "bg-slate-50 dark:bg-zinc-800",
            border: "border-slate-200 dark:border-zinc-700",
            text: "text-slate-600 dark:text-slate-300",
            title: "ราคาสุดท้ายก่อนจบ",
            subTitle: "บิดถัดไป",
            icon: <RiseOutlined />,
        },
        2: {
            bg: "bg-orange-50 dark:bg-orange-950/40",
            border: "border-orange-200 dark:border-orange-900",
            text: "text-orange-600 dark:text-orange-400",
            title: "ใกล้สิ้นสุด",
            subTitle: "Trend UP",
            icon: <FieldTimeOutlined />,
        },
        3: {
            bg: "bg-red-50 dark:bg-red-950/40",
            border: "border-red-200 dark:border-red-900",
            text: "text-red-600 dark:text-red-400",
            title: "ราคาสุดท้ายก่อนจบ",
            subTitle: "New Bid!",
            icon: <ThunderboltFilled />,
        },
    };

    const { bg, text, border, title, subTitle, icon } = dataConfig[state] || {
        bg: "bg-white dark:bg-zinc-900",
        border: "border-gray-100 dark:border-zinc-700",
        text: "text-black dark:text-white",
        title: "",
        subTitle: "",
        icon: null,
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative aspect-video overflow-hidden">
                <Image
                    src={src}
                    alt={productName}
                    width={300}
                    height={200}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {state === 3 && (
                    <div className="absolute top-3 left-3">
                        <UseTag variant="solid" icon={FireFilled} color="red" label="ร้อนแรง" />
                    </div>
                )}
                <div className="absolute bottom-3 right-3">
                    <UseTag
                        variant="solid"
                        color={state === 3 ? "red" : "#222329"}
                        label={time}
                        className="py-0.5! px-3! text-xs! font-bold!"
                    />
                </div>
                {state === 3 && (
                    <div className="absolute inset-0 bg-red-600/5 pointer-events-none border-4 border-red-500/20 rounded-t-xl"></div>
                )}
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{productName}</h3>
                    <button className="size-8 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-red-600 transition-colors cursor-pointer">
                        {favorite ? (
                            <HeartFilled style={{ fontSize: "20px" }} />
                        ) : (
                            <HeartOutlined style={{ fontSize: "20px" }} />
                        )}
                    </button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <UseAvatarGroup items={items} size="small" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">{countItems} ผู้ประมูลล่าสุด</p>
                </div>
                <div className={`${bg} ${border} rounded-xl p-4 mb-4 border`}>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className={`${text} text-xs mb-1 font-bold`}>{title}</p>
                            <p
                                className={`${state === 3 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"} text-2xl font-bold`}
                            >
                                ฿{livePrice?.toLocaleString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div
                                className={`${text} flex items-center gap-1 text-sm font-bold ${state === 3 ? "animate-bounce" : ""} `}
                            >
                                {icon} {subTitle}
                            </div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <UseButton label={`฿${priceBid?.toLocaleString()}`} size="large" type="default" wFull />
                    <UseButton label="เสนอราคาด่วน" size="large" onClick={() => router.push(`/product/${id}`)} wFull />
                </div>
            </div>
        </div>
    );
}

export default CardProductLive;
