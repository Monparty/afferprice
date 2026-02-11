"use client";
import Image from "next/image";
import UseButton from "../inputs/UseButton";
import { FieldTimeOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";

function CardProduct({ image, time, category, name, price, bid, favorite }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-square">
                <Image src={image} width={40} height={40} className="w-full h-full object-cover" unoptimized />
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
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{category}</p>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{name}</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary">{price.toLocaleString()} บาท</span>
                        <span className="text-xs text-slate-400">{bid} ประมูล</span>
                    </div>
                </div>
                <UseButton label="เสนอราคาประมูล" size="large" wFull />
            </div>
        </div>
    );
}

export default CardProduct;
