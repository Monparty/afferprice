import React from "react";

function Page() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 md:px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-primary">
                        <div className="size-8 bg-primary text-white rounded flex items-center justify-center">
                            <span className="material-symbols-outlined">gavel</span>
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight">Afferprice</h2>
                    </div>
                    <div className="hidden md:flex">
                        <label className="flex flex-col min-w-40 h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                <div className="text-slate-400 flex border-none bg-slate-100 items-center justify-center pl-4 rounded-l-lg">
                                    <span className="material-symbols-outlined text-[20px]">search</span>
                                </div>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 border-none bg-slate-100 focus:ring-0 h-full placeholder:text-slate-400 px-4 rounded-r-lg text-sm font-normal"
                                    placeholder="ค้นหาการประมูล..."
                                    // value=""
                                />
                            </div>
                        </label>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <nav className="hidden lg:flex items-center gap-6">
                        <a className="text-sm font-medium hover:text-accent-success transition-colors" href="#">
                            การประมูล
                        </a>
                        <a className="text-sm font-medium hover:text-accent-success transition-colors" href="#">
                            หมวดหมู่
                        </a>
                        <a className="text-sm font-medium hover:text-accent-success transition-colors" href="#">
                            ลงขาย
                        </a>
                    </nav>
                    <div className="flex gap-2">
                        <button className="relative flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-accent-danger rounded-full border-2 border-white"></span>
                        </button>
                        <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                            <span className="material-symbols-outlined">account_circle</span>
                        </button>
                    </div>
                    <div className="size-10 rounded-full border-2 border-accent-success p-0.5">
                        <div
                            className="h-full w-full rounded-full bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDe4-Ul_aoVWUg7isFoqEsHRgFgJXz8LL2iZBAm1mzvQLw5JZ8J_gqzH9iu9MqSx2oTX_1JpCrii1blXZzQqq6m2PsxmjnM4XJmekgRxsB-MA5bMNtSdQXWL5EwPVFS4RzettJOT78KfFeccqJnzI9AcN_nULsTPceUr0zowvvgpRpXHbL7RX63jCYNR3eW5kXI-A7cwOQ3q5UNwM0kes5nNmdS4xUuke20I5w6a45oiYvEsycYxmRD86w8q5vgj3hFWrRML7I4xik')",
                            }}
                        ></div>
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8">
                <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900">
                            แดชบอร์ดผู้ใช้งาน
                        </h1>
                        <p className="text-slate-500 text-base font-normal">
                            ยินดีต้อนรับกลับมา, คุณอเล็กซ์ นี่คือสรุปภาพรวมการประมูลของคุณ
                        </p>
                    </div>
                    <button className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:opacity-90">
                        <span className="truncate">ดาวน์โหลดรายงาน</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                การประมูลที่กำลังร่วม
                            </p>
                            <span className="material-symbols-outlined text-accent-success">trending_up</span>
                        </div>
                        <p className="text-3xl font-bold leading-tight">12</p>
                        <div className="flex items-center gap-1">
                            <span className="text-accent-success text-xs font-bold">+2 วันนี้</span>
                            <span className="text-slate-400 text-xs">จากเมื่อวาน</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                สินค้าที่ชนะ
                            </p>
                            <span className="material-symbols-outlined text-blue-500">emoji_events</span>
                        </div>
                        <p className="text-3xl font-bold leading-tight">48</p>
                        <div className="flex items-center gap-1">
                            <span className="text-accent-success text-xs font-bold">+1 สัปดาห์นี้</span>
                            <span className="text-slate-400 text-xs">มูลค่ารวม $12.4k</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">กำลังติดตาม</p>
                            <span className="material-symbols-outlined text-orange-500">visibility</span>
                        </div>
                        <p className="text-3xl font-bold leading-tight">25</p>
                        <div className="flex items-center gap-1">
                            <span className="text-accent-success text-xs font-bold">+5 รายการใหม่</span>
                            <span className="text-slate-400 text-xs">กำลังจะสิ้นสุด</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h2 className="text-xl font-bold">รายการประมูลปัจจุบันของคุณ</h2>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white shadow-sm">
                                ทั้งหมด
                            </button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">
                                กำลังนำ
                            </button>
                            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">
                                ถูกแซง
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-6 py-4 font-semibold">รายละเอียดสินค้า</th>
                                    <th className="px-6 py-4 font-semibold text-center">สถานะ</th>
                                    <th className="px-6 py-4 font-semibold">ราคาที่คุณเสนอ</th>
                                    <th className="px-6 py-4 font-semibold">ราคาสูงสุดปัจจุบัน</th>
                                    <th className="px-6 py-4 font-semibold">เวลาที่เหลือ</th>
                                    <th className="px-6 py-4 font-semibold text-right">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="h-16 w-16 rounded-lg bg-cover bg-center bg-slate-200 flex-shrink-0"
                                                style={{
                                                    backgroundImage:
                                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVDrmazoyd1mSWXIX8C5uLC0lVXl0QTNoQEKtXBc0cniuBwA5dTikcheJi6PWV5ndM1VrNCCQLdXwOCv7ZXYPqcSvEU0-vl4PInvzhMDloVTF2ZBAGjpRb46q7eXoHqJ5ZWsYrF0hBEmb609DM1Z9FPYkmZ6RCwpPWyHmetL3IuAVV2TQKk1FB9chkv-Qe7lwMvcZths5QQ51IRhvBz_DQdYl93QaYpMz3zHmB59nT8zAi5vX3Dru_e0H8KLvZMDIli19ac848l-4')",
                                                }}
                                            ></div>
                                            <div>
                                                <p className="font-bold text-sm">Zenith Chronomaster Sport</p>
                                                <p className="text-xs text-slate-400">รหัส: 03.3100.3600</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-accent-success/10 text-accent-success border border-accent-success/20">
                                            <span className="size-1.5 rounded-full bg-accent-success animate-pulse"></span>
                                            คุณกำลังนำ
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm">$8,450</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm text-accent-success">$8,450</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            <p className="text-sm font-medium">02ช 14น 05ว</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-slate-50 transition-colors bg-accent-danger/[0.02]">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="h-16 w-16 rounded-lg bg-cover bg-center bg-slate-200 flex-shrink-0"
                                                style={{
                                                    backgroundImage:
                                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgdzZT-opYfE6BBIrQweYTzs0g310avKxlnuMZLX9moBsh4I1o2kszampT76hinJm5nIdeBP10Fp4U_dW5ExSONpDstISo2NkoYGXRaVtwRxE8KC4B0foC9PPaygHED2ssc8f48uRNjQErIPWDEzaJLFsS0UGY5wQZ29-oHFV0jxYSfW1PCc3ZyHyyH872xX5_Ts8ruwm1p7tdoNgNxMOkmYBZOBzUolY7RXKGbp_PeplCX5x0_LxKu37giqhJa-aZbWYVY37-xI8')",
                                                }}
                                            ></div>
                                            <div>
                                                <p className="font-bold text-sm">Nike Air Max Rare Edition</p>
                                                <p className="text-xs text-slate-400">ขนาด: 10.5 US</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-accent-danger text-white">
                                            <span className="material-symbols-outlined text-[12px] fill-1">
                                                warning
                                            </span>
                                            ถูกประมูลแซง
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm">$220</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm text-accent-danger">$245</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-accent-danger">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            <p className="text-sm font-bold">00ช 15น 32ว</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:scale-105 transition-transform">
                                            ประมูลด่วน
                                        </button>
                                    </td>
                                </tr>
                                <tr className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="h-16 w-16 rounded-lg bg-cover bg-center bg-slate-200 flex-shrink-0"
                                                style={{
                                                    backgroundImage:
                                                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1xU07ko97-pkV_bsvSSraf6UMsvL1a9d4GbkDnMauskAxRYOMM_aH-Rxr6haMhvbbNw_PCOnliIW9bJ-1qA0p9DYpXJzhIa3RMpbmSG_MFU1Faa1EuWA1ulBSPUk7YSWP61jwhQyH5Aia-Mien9paEKSMyrzId1kJkWiMEnUHgsJTxIWjp1o2UvlPJrr8vJqEdxJcpf6PnrIgQgMCL-cAS79rPDMSMnbTE5k2gSaxvhtmHHX1v8gVkp4PBISikptETuv1mfvoA3o')",
                                                }}
                                            ></div>
                                            <div>
                                                <p className="font-bold text-sm">Bose QuietComfort Ultra</p>
                                                <p className="text-xs text-slate-400">สภาพใหม่</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500">
                                            กำลังติดตาม
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm text-slate-400">--</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm">$315</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-slate-500">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            <p className="text-sm font-medium">1ว 04ช 12น</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="bg-slate-100 text-slate-900 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                                            เริ่มประมูล
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-slate-50 flex justify-center">
                        <button className="text-xs font-bold text-primary hover:underline">
                            ดูประวัติการประมูลทั้งหมด
                        </button>
                    </div>
                </div>
                <div className="mt-12 py-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        <span className="text-xs font-medium uppercase tracking-widest">
                            ปลอดภัยด้วยระบบ Afferprice TrustEngine
                        </span>
                    </div>
                    <div className="flex gap-8 text-xs font-bold text-slate-500">
                        <a className="hover:text-primary" href="#">
                            เงื่อนไขการประมูล
                        </a>
                        <a className="hover:text-primary" href="#">
                            นโยบายความเป็นส่วนตัว
                        </a>
                        <a className="hover:text-primary" href="#">
                            ศูนย์ช่วยเหลือ
                        </a>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="size-2 bg-accent-success rounded-full"></span>
                        <span>สถานะตลาด: เชื่อมต่อแล้ว</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Page;
