function Page() {
    return (
        <>
            <div class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div class="flex justify-between items-start">
                            <p class="text-slate-500 text-sm font-medium">รายได้ทั้งหมด</p>
                            <span class="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                +12.5%
                            </span>
                        </div>
                        <h3 class="text-2xl font-bold text-navy-deep tracking-tight">฿1,250,000</h3>
                        <div class="mt-2 h-10 w-full">
                            <svg class="w-full h-full" preserveaspectratio="none" viewbox="0 0 100 40">
                                <path
                                    d="M0 40 L10 30 L20 35 L30 20 L40 25 L50 10 L60 15 L70 5 L80 12 L90 8 L100 15"
                                    fill="none"
                                    stroke="#f27f0d"
                                    stroke-width="2"
                                    vector-effect="non-scaling-stroke"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div class="flex justify-between items-start">
                            <p class="text-slate-500 text-sm font-medium">การประมูลที่ใช้งานอยู่</p>
                            <span class="material-symbols-outlined text-primary">campaign</span>
                        </div>
                        <h3 class="text-2xl font-bold text-navy-deep tracking-tight">452</h3>
                        <p class="text-slate-400 text-xs">อัปเดตเมื่อ 5 นาทีที่แล้ว</p>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div class="flex justify-between items-start">
                            <p class="text-slate-500 text-sm font-medium">รอการอนุมัติ</p>
                            <span class="material-symbols-outlined text-amber-500">pending_actions</span>
                        </div>
                        <h3 class="text-2xl font-bold text-navy-deep tracking-tight text-amber-500">28</h3>
                        <p class="text-slate-400 text-xs">ต้องดำเนินการเร่งด่วน</p>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
                        <div class="flex justify-between items-start">
                            <p class="text-slate-500 text-sm font-medium">ผู้ใช้งานใหม่</p>
                            <span class="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                                +15%
                            </span>
                        </div>
                        <h3 class="text-2xl font-bold text-navy-deep tracking-tight">124</h3>
                        <p class="text-slate-400 text-xs">ใน 7 วันล่าสุด</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-navy-deep">การจัดการการประมูล</h3>
                        <div class="flex gap-2">
                            <button class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
                                กรองข้อมูล
                            </button>
                            <button class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-lg shadow-primary/20">
                                เพิ่มการประมูลใหม่
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-100">
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        สินค้า
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        ชื่อผู้ขาย
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        ราคาประมูลล่าสุด
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        เวลาที่เหลือ
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        สถานะ
                                    </th>
                                    <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                                        จัดการ
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                                                <img
                                                    class="w-full h-full object-cover"
                                                    data-alt="Modern watch product"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCQjZ01Arw1b9ZFBWlufY3dYSw9F8wBa4bDk86wKzVEM3bace-bmKjbn0lQVXlbIK8PaXx0cMdT4Rp6TZn6FJE5hxHKzBonMybJR0HW3XzbxCaTdJGTAZ89u6cy9mxhF0G1R700pRcnuikBkCdyxHobFt1OBh7zqnSRx3v4ka8qt4JemmXR-4hEs2PaTFelhvs4D3nl8JasyYhQyJUzewoOe2xGwWn3vSF66Uq8rjQhuh6Te4WBgu5mDM_OjFSRZOgSvEf0MBJd4o"
                                                />
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-navy-deep">Luxury Silver Watch</p>
                                                <p class="text-xs text-slate-500 truncate w-32">
                                                    หมวดหมู่: เครื่องประดับ
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-600">วิชัย สมบัติ</td>
                                    <td class="px-6 py-4 font-bold text-primary">฿45,500</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">02 ชม. 15 นาที</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                            Active
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-1">
                                        <button
                                            class="p-2 hover:bg-slate-200 rounded-lg text-slate-500"
                                            title="ดูรายละเอียด"
                                        >
                                            <span class="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                        <button class="p-2 hover:bg-red-50 rounded-lg text-red-500" title="บล็อก">
                                            <span class="material-symbols-outlined text-lg">flag</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                                                <img
                                                    class="w-full h-full object-cover"
                                                    data-alt="Wireless headphones product"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL0fWL2HmD4topIj35IA-NCxoQtVeeZ0ZmJNP57VddhnStAaKAYS_Lv_QsN1epX0vM6dqyYIkC10xp7wbD-OYfFPjagh-EInHhrHM3Z5243k1kg7_9s3IjZVWVyKDRm8-ZfO6SvV4MAywlgfMAtj10vRNCKeyni9yf_MEh1723_bQUL6kyztbEVpyZwB9Q91HSnelopX3s-cP4rV7zYF94MFC8KkrnmcVo3yr0CdFttZFqFrDy7ySiQat_tM5jX4nwVW37gX5UIOU"
                                                />
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-navy-deep">Sony Wireless Headphones</p>
                                                <p class="text-xs text-slate-500 truncate w-32">
                                                    หมวดหมู่: อิเล็กทรอนิกส์
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-600">กนกพร ใจดี</td>
                                    <td class="px-6 py-4 font-bold text-primary">฿8,200</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">รอดำเนินการ</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                            Pending
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-2">
                                        <button class="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600">
                                            อนุมัติ
                                        </button>
                                        <button class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">
                                            ปฏิเสธ
                                        </button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                                                <img
                                                    class="w-full h-full object-cover"
                                                    data-alt="Macbook Pro product"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzqX7-9TIU6IcsQPWq2qzxqtVGafNWfCFDRzVH7VLo8s8lKcNH2i7aoFAy6CWdPZQuInq4Sa9PWSgkvihhY7RCBIXULJTz3FGP50XdtE2YNVX2tXWur1CgWxLKC7rN7xY-7kJWvDPWRf6pejY5jAsjShuSv-WdvMrZ3T0ufiU3HDvq14ziYLOSfoqnrRIlaFki153Ka6W4zPbUbu1kiODKj7ipHgua7bkUngdzNvv9jlFyR_b2ad78UUTsUMn71z668m6GA3_9gDA"
                                                />
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-navy-deep">MacBook Pro M2 2023</p>
                                                <p class="text-xs text-slate-500 truncate w-32">
                                                    หมวดหมู่: คอมพิวเตอร์
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-600">ธนาพงศ์ สุขใจ</td>
                                    <td class="px-6 py-4 font-bold text-primary">฿52,000</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">05 นาที</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                                            Flagged
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-1">
                                        <button
                                            class="p-2 hover:bg-slate-200 rounded-lg text-slate-500"
                                            title="ดูรายละเอียด"
                                        >
                                            <span class="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                        <button class="p-2 bg-red-500 text-white rounded-lg" title="ลบการประมูล">
                                            <span class="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                                                <img
                                                    class="w-full h-full object-cover"
                                                    data-alt="Red sneakers product"
                                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsBerr5qV_bMZPnFkfamQ0QkMSVKhPbyV6KBMy-tEKZGWS1OztHpdw-eZEFB0ATksv3j6V9M-cC26k26UOgoMU8VQzb8mJUBRwXUtPwDl6xoRrWGtuau5147XPyvSGoELjJoBffMFGuHJWbxDjgQeX5B2QxydtLaLANzBLA5BfpiLNQUPh8IyVL7Na26n1rt1e8zfvUcT8cggU36v5ktUyVEOSyJD-aOpXlsAXFiQnGK_0ClaBq_awQc2RGhimw42jKwAMtVMvo1U"
                                                />
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-navy-deep">Nike Air Max Red</p>
                                                <p class="text-xs text-slate-500 truncate w-32">หมวดหมู่: แฟชั่น</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-600">สมหญิง รักดี</td>
                                    <td class="px-6 py-4 font-bold text-primary">฿3,500</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">12 ชม. 40 นาที</td>
                                    <td class="px-6 py-4">
                                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                            Active
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right space-x-1">
                                        <button
                                            class="p-2 hover:bg-slate-200 rounded-lg text-slate-500"
                                            title="ดูรายละเอียด"
                                        >
                                            <span class="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                        <button class="p-2 hover:bg-red-50 rounded-lg text-red-500" title="บล็อก">
                                            <span class="material-symbols-outlined text-lg">flag</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="p-6 border-t border-slate-100 flex items-center justify-between">
                        <p class="text-sm text-slate-500">แสดง 1 ถึง 4 จากทั้งหมด 452 รายการ</p>
                        <div class="flex gap-2">
                            <button
                                class="px-3 py-1 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
                                disabled=""
                            >
                                ก่อนหน้า
                            </button>
                            <button class="px-3 py-1 bg-primary text-white rounded-lg text-sm font-bold">1</button>
                            <button class="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                                2
                            </button>
                            <button class="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                                3
                            </button>
                            <button class="px-3 py-1 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
                                ถัดไป
                            </button>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h4 class="font-bold text-navy-deep mb-4">กิจกรรมล่าสุด</h4>
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p class="text-sm text-navy-deep">
                                        <span class="font-bold">คุณพงษ์เทพ</span> ได้ประมูล{" "}
                                        <span class="text-primary font-bold">Luxury Silver Watch</span> ในราคา ฿45,500
                                    </p>
                                    <p class="text-xs text-slate-400">2 นาทีที่ผ่านมา</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p class="text-sm text-navy-deep">
                                        อนุมัติผู้ใช้งานใหม่ <span class="font-bold">กมลวรรณ ทรัพย์มาก</span>{" "}
                                        เข้าสู่ระบบ
                                    </p>
                                    <p class="text-xs text-slate-400">15 นาทีที่ผ่านมา</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p class="text-sm text-navy-deep">
                                        ได้รับคำขอถอนเงินจำนวน <span class="font-bold">฿12,000</span> จาก{" "}
                                        <span class="font-bold">วิชัย สมบัติ</span>
                                    </p>
                                    <p class="text-xs text-slate-400">40 นาทีที่ผ่านมา</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-navy-deep p-6 rounded-xl shadow-lg relative overflow-hidden group">
                        <div class="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h4 class="text-white font-bold text-xl mb-2">สรุปรายงานประจำเดือน</h4>
                                <p class="text-slate-300 text-sm leading-relaxed">
                                    ข้อมูลการวิเคราะห์การเติบโตของแพลตฟอร์มในเดือนนี้ พร้อมดาวน์โหลดเป็น PDF หรือ CSV
                                    เพื่อการนำเสนอ
                                </p>
                            </div>
                            <button class="mt-6 w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-orange-950/20">
                                <span class="material-symbols-outlined">download</span>
                                ดาวน์โหลดรายงาน
                            </button>
                        </div>
                        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
                        <div class="absolute -left-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;
