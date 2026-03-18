import UseButton from "@/app/components/inputs/UseButton";
import CardProductLive from "@/app/components/utils/CardProductLive";
import UsePagination from "@/app/components/utils/UsePagination";

function Page() {
    return (
        <main>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-red-500 font-bold text-sm uppercase tracking-wider">
                            กำลังประมูล (Live)
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">กำลังจะจบเร็วๆ นี้</h1>
                    <p className="text-slate-500 mt-1">รีบเสนอราคาเลย! รายการเหล่านี้กำลังจะปิดการประมูลในไม่ช้า</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                    <UseButton label="จบเร็วที่สุด" size="large" />
                    <UseButton label="ยอดนิยม" type="default" size="large" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CardProductLive
                    state={1}
                    src="https://picsum.photos/200/301"
                    productName="สกู๊ตเตอร์ไฟฟ้า ผู้สูงอายุ"
                    price={2000}
                    items={[{ firstName: "mon" }, { firstName: "cat" }]}
                    desc="10 วินาทีที่แล้ว"
                    time="01:20:18"
                />
                <CardProductLive
                    state={3}
                    src="https://picsum.photos/200/302"
                    productName="มีดผลไม้ปลายแหลม"
                    price={100}
                    items={[{ firstName: "mon" }, { firstName: "cat" }, { firstName: "xox" }, { firstName: "mock" }]}
                    desc="+ ฿900 ล่าสุด"
                    time="01:20:18"
                />
                <CardProductLive
                    state={2}
                    src="https://picsum.photos/200/303"
                    productName="กระทะทรงลึกเกรซ 28 ซม (เซรามิค)"
                    price={800}
                    items={[{ firstName: "pim" }, { firstName: "sam" }, { firstName: "top" }]}
                    desc="88 บิดทั้งหมด"
                    time="01:20:18"
                    favorite
                />
                <CardProductLive
                    state={2}
                    src="https://picsum.photos/200/304"
                    productName="กระทะทรงลึกเกรซ 28 ซม (เซรามิค)"
                    price={800}
                    items={[{ firstName: "pim" }, { firstName: "sam" }, { firstName: "top" }]}
                    desc="88 บิดทั้งหมด"
                    time="01:20:18"
                    favorite
                />
                <CardProductLive
                    state={3}
                    src="https://picsum.photos/200/305"
                    productName="มีดผลไม้ปลายแหลม"
                    price={100}
                    items={[{ firstName: "mon" }, { firstName: "cat" }, { firstName: "xox" }, { firstName: "mock" }]}
                    desc="+ ฿900 ล่าสุด"
                    time="01:20:18"
                />
            </div>
            <div className="mt-12">
                <UsePagination />
            </div>
        </main>
    );
}

export default Page;
