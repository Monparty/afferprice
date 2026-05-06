import Image from "next/image";
import UseButton from "../inputs/UseButton";
import { FieldTimeOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

function CardProduct({ id, image, time, category, name, price, bid, favorite }) {
    // ใช้ที่ "/"
    const router = useRouter();

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-square">
                <Image
                    src={image}
                    width={40}
                    height={40}
                    alt={name}
                    className="w-full h-90 object-cover"
                    unoptimized
                />
                <div className="absolute top-3 right-3">
                    <button className="size-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-red-600 transition-colors cursor-pointer">
                        {favorite ? (
                            <HeartFilled style={{ fontSize: "20px" }} />
                        ) : (
                            <HeartOutlined style={{ fontSize: "20px" }} />
                        )}
                    </button>
                </div>
                <div className="absolute bottom-3 left-3 bg-accent-orange px-2 py-1 rounded text-[11px] font-bold flex items-center gap-2 shadow-lg border border-orange-600 text-orange-600 bg-white">
                    <FieldTimeOutlined style={{ fontSize: "20px" }} />
                    {time}
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-3">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                        {category}
                    </p>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary">{price?.toLocaleString()} บาท</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{bid} ประมูล</span>
                    </div>
                </div>
                <UseButton label="เสนอราคาประมูล" size="large" onClick={() => router.push(`/product/${id}`)} wFull />
            </div>
        </div>
    );
}

export default CardProduct;
