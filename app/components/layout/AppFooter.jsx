"use client"
import UseButton from "../inputs/UseButton";
import InputText from "../inputs/InputText";
import { useForm } from "react-hook-form";

function AppFooter() {
    const { control } = useForm();

    return (
        <footer className="mt-20 border-t border-slate-200 py-12 bg-slate-900 text-slate-400">
            <div className="w-full max-w-360 mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 space-y-4">
                        <div className="flex items-center gap-2 text-white">
                            <h2 className="text-xl font-extrabold tracking-tight">Afferprice</h2>
                        </div>
                        <p className="text-sm leading-relaxed">
                            แพลตฟอร์มประมูลสินค้าหรูชั้นนำระดับโลก มั่นใจได้ด้วยระบบตรวจสอบความถูกต้องแบบเรียลไทม์
                        </p>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-white font-bold mb-4">แพลตฟอร์ม</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    การประมูลสด
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    สินค้าใหม่เร็วๆ นี้
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    ขั้นตอนการตรวจสอบ
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    ค่าธรรมเนียม
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-white font-bold mb-4">ช่วยเหลือ</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    ศูนย์ช่วยเหลือ
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    การคุ้มครองผู้ซื้อ
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    คู่มือการขาย
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-accent-orange transition-colors" href="#">
                                    ติดต่อเรา
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-white font-bold mb-4">ข่าวสาร</h4>
                        <p className="text-sm mb-4">รับข่าวสารเกี่ยวกับสินค้าหายากก่อนใคร</p>
                        <div className="flex gap-2">
                            <InputText control={control} name="email" placeholder="อีเมลของคุณ" />
                            <UseButton label="ติดตาม" />
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© 2023 Afferprice Global Inc. สงวนลิขสิทธิ์.</p>
                    <div className="flex gap-6">
                        <a className="hover:text-white" href="#">
                            นโยบายความเป็นส่วนตัว
                        </a>
                        <a className="hover:text-white" href="#">
                            เงื่อนไขการให้บริการ
                        </a>
                        <a className="hover:text-white" href="#">
                            นโยบายคุกกี้
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;
