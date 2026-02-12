import UseButton from "../inputs/UseButton";
import UseTag from "./UseTag";

function CardZoomImage({ backgroundImage, title, price, bid, state = false }) {
    return (
        <div className="flex-none w-87.5 md:w-150 h-87.5 relative rounded-xl overflow-hidden group">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                }}
            ></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                <div className="space-y-1">
                    <UseTag label={state ? "กำลังจะจบ" : "แนะนำ"} variant="solid" color={state ? "red" : "blue"} />
                    <h3 className="text-white text-2xl font-bold mt-2">{title}</h3>
                    <div className="flex items-center gap-3 text-white/90">
                        <p className="text-lg font-medium">
                            ราคาปัจจุบัน: <span className="text-white font-bold">{price.toLocaleString()} บาท</span>
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">{bid} การประมูล</span>
                    </div>
                </div>
                <UseButton label="เข้าร่วมประมูล" />
            </div>
        </div>
    );
}

export default CardZoomImage;
