function Page() {
    return (
        <main>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-3 w-3 rounded-full bg-red-500 live-dot"></span>
                        <span className="text-red-500 font-bold text-sm uppercase tracking-wider">
                            กำลังประมูล (Live)
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">กำลังจะจบเร็วๆ นี้</h1>
                    <p className="text-slate-500 mt-1">รีบเสนอราคาเลย! รายการเหล่านี้กำลังจะปิดการประมูลในไม่ช้า</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium whitespace-nowrap">
                        <span className="material-symbols-outlined text-lg">schedule</span>
                        จบเร็วที่สุด
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:border-primary transition-colors whitespace-nowrap">
                        <span className="material-symbols-outlined text-lg">trending_up</span>
                        ยอดนิยม
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:border-primary transition-colors whitespace-nowrap">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        ตัวกรอง
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border-2 border-primary/20 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-alt="Luxury mechanical watch on display"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0Vz3tlqt81xrZ5U4DQ6B9zTI3sEWPGTgla9ecmHRulmV9kHYXXnjToY8_CuO0wOPS4tcWW4oay6iASEjdhUC2g1cMJXOHuPYTeCtViLr4UZfKYKtvKFzWwGHZflZ1_UmR_eXKsMgah8UVNHTYdM_eE12anyeE6yoMOBncm78BLvfdg_Z1ZO7zSgMPUwEoTkj0osICbGftuI6PzAxnr7caDTAAfbuUvx9BivrwZbFDZirk2sDOc_R2l80N0066ZA8EDfCy8ZyzRHI"
                        />
                        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">local_fire_department</span> ร้อนแรง
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-mono">
                            02:45:12
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">
                                Omega Seamaster Professional 300M
                            </h3>
                            <span className="text-slate-400 material-symbols-outlined cursor-pointer hover:text-red-500">
                                favorite
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="User avatar small"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJiiQz6pzv9NMV4bv7Q-bkUMt3NjMznWetljQgtGsFghNp5CmFmPNn6PHeywGiun0Yb1tBFa2NWpo9dzD1elRPednKORfZUE9qEpJzgB0oGG_adEPS26vTRY9jDlLtFhEeAXSQPnbvRj_TtBaRmIxP8P-lEgjQd7GfDG3_UCoDppgZ42vIKDkBs1VL8cIE_HvjvYqZHNoyBbbji4fykf3OI37_e8pOioFRwHsGZZ_28cCtdzCt70pg8mcUYKcyhpmYixifN-KjO60"
                                    />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="User avatar small"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbqMWNteApKWFEwncaN7YqFGBudtVlar3jt76zl1HaVtGzGyVS1yxIGUbH8tF4ep2V6c-pMQ_8dE7MJmvR8hMPKNXWYGmOb8N22A2u9utt6K1nZ-jp1Bp7mVOybEqdDRErei8x6pMb3AgcKOCzb0UpALA4YnPv4eaS5DshIsllaqkmazpz9ZhboYQSkwWc0Ju-Phevn_3ox-Mj0M-gnq8RSz78tvQqfPJSoZO-qCd00q9p7G7V8DIA5hzv5hgjW8BUt8XdWkHVpgQ"
                                    />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="User avatar small"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkNwfd0ROwSJzPE2ymAsv_kIVdaeBB3P8pX-wtCvDt39EPVTCjsWw2bCqM_B-BI-OLHa6FjHYcdpOkXk7deYWTlcFsSZJ745eDZoCks3tBdQci_kymA9X7K7VC24Yf1nF2TbmKzZtxs4SIui2jIEhYewY7sVVXWRl0BXCBk06LY-xRzZRRyF2MTlXHB3E6SI1wNuhzgx-fTdgU_O223e2_HEFwZuedsPd6VIttlhK8vg1Pg2HvsplyaK2cnorLkNP1ZBbC6ez997I"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">24 ผู้ประมูลล่าสุด</p>
                        </div>
                        <div className="bg-primary/5 rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">ราคาปัจจุบัน</p>
                                    <p className="text-2xl font-bold text-primary">฿142,500</p>
                                </div>
                                <div className="text-right">
                                    <div className="h-6 w-24 bg-primary/10 rounded overflow-hidden relative mb-1">
                                        <div className="absolute inset-0 bg-primary/20 w-3/4"></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-primary font-bold">
                                            Trend: UP
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400">+฿2,500 ล่าสุด</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors">
                                ฿143,000
                            </button>
                            <button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                เสนอราคาด่วน
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-alt="classNameic sport car profile"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKlkRBBBfHNZVmV2ydE2ozAteLbLSDVS-ta8mtbkua7O_jHguNmp-5Iu0lC8Y1IVZkjK7tf_yKXYdP8fCttRaw3rEMFg7V8j8o-ewxJlkLAGIbHq2P8rzBA-qL3zHVcxaKKIr6VbaXxMPI1D1tS10R_HGOXnEkekbpkrEU_QIey7Kn0G3CnoNvFT-iYK9ynZsoC2qUiisLLewg4gxRYFEyHMNjCgzxmBZ-wer7-vjEV7duo-q9Aa3-mCd177MmjHmwARD1f7PUVBc"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-mono">
                            00:12:05
                        </div>
                        <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                            Rare Item
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">
                                Porsche 911 Carrera S (992)
                            </h3>
                            <span className="text-slate-400 material-symbols-outlined cursor-pointer hover:text-red-500">
                                favorite
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="User avatar small"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVeO9GLP-wQpr_TlYfqfDOkidEqBTItR_ka3FiEjIvBHZ1ZoqR7qEeIY8rBEIgMw0JujRijythx-6SBO3ucExjSoBoTo8wydA-UoC8SQmy3hF9cfDbJUDvOW_KppClpUXjefXm2q1UqkXs4SNBGUT1JK7xiNg0AsOH8MHfa2S11Nq6mLuEqM-Q97DYKEBtoQieMrgzfGViUv5Z1FaMZcCGD9gobU8oVu9fK2WB6k2Eu549F5eii6ve2dcineNfiARiaqD6Cfj1kRI"
                                    />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="User avatar small"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc08m2Lpk_u2GNxBWrEBDchNkES4QO09MUGsK8S_hkFCd-B4C_88eFG4P9Vhlqft_RXtLdYzzIBuKqMPSX7WjWNKKDn-I29qFmmRuuca-xdO4sECD8utDRstQGcbqDM9yvL5sQdTSJopROV66qAAp7HQK4wepWR3yzBaUQ1UxB4FBkXWqWy2uD4PccI71Pqvze4vO5Kcv6UL6UROjI6aZeuNJaB7qGeRU0ENB2VjuXMA3woupAJ4W0SiB0XQRz4C8Lr34OCva9zHA"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">8 ผู้ประมูลล่าสุด</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">ราคาปัจจุบัน</p>
                                    <p className="text-2xl font-bold text-slate-900">฿8,450,000</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                                        <span className="material-symbols-outlined text-sm">trending_up</span> 12%
                                    </div>
                                    <p className="text-[10px] text-slate-400">จากราคาเริ่มต้น</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors">
                                ฿8,500,000
                            </button>
                            <button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                เสนอราคาด่วน
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-alt="Modern luxury penthouse interior"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUv8E4TlGJWtzIlF8izHUN2RqDVW84a3jAjXlCjTbdtyFse4i2BZ1iVkc6D7VWlVO4lX1fC8MBwrmbhPWViHKUtFWkfkjgW2ESw4k6zqF5J0c5hEv7fHuRGKwLuz952_9fQO2CYS_Y-awIQDg5P0ctuQPzlWJP9KlLG1r_M5-XrwlSdC80HufFlSTqn3Itewrq9-__jtOGk1lnFXtKxuOkOJEuaJwcyVhmvk3L_t1Mp1ssbu0gyZXkvEQjwDXkOiK72Rfps6-9Sk"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-mono">
                            05:30:45
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">
                                Luxury Penthouse - Sukhumvit 24
                            </h3>
                            <span className="text-slate-400 material-symbols-outlined cursor-pointer hover:text-red-500">
                                favorite
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        data-alt="User avatar small"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtVrNLskkWDHl0W7Udg8G8doTBBg7uxyMyNlBYsm60MVn_WXwbFRSJ_FSW-_gXJWkpqsN8ex17tn_TmRfOj7BJ86z5XYCY_G6dsYAWVEPOR4Qq-7nM7ZQqbwJD2M9zaYPILRpNBpv8ihkxFFDnC_dvPGCCUVmV6BjYETrevLSe8CA0Cj9ZeqZISVhOPMUGzi9UrtbY1EVqF5ATdR3RetPApgYHXLLYyXfbAtri--RTtmEmnwMEHavOqdZ0ZZCwun_CX2XaafubbWk"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">15 ผู้ประมูลล่าสุด</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">ราคาปัจจุบัน</p>
                                    <p className="text-2xl font-bold text-slate-900">฿45,000,000</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-slate-400 text-sm font-bold">
                                        <span className="material-symbols-outlined text-sm">show_chart</span> Stable
                                    </div>
                                    <p className="text-[10px] text-slate-400">ประมูลเงียบ</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors">
                                ฿45,500,000
                            </button>
                            <button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                เสนอราคาด่วน
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-alt="Limited edition red sneakers"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeP0r9AY8umJ18TkFb82ET1ynhPgWq8C0RrspfBQmDfrrc-pDpDcdj7RwY34NAfWxTfwnRY7MT74EAiONQj17Cwv6HKEeij4DJ5CI-f73T28GrS543qgHdS8-KgzLpq6baMxGoUeEFDOA1wMdRvNzrHSu0f7TMkhTS2Eji-IVecL67iOkjdzMAjAlgpVjcTJNzPN_rtgHpfyAnH9oW5RUDSknzokzJ4uOLR_wqNTSKVqmyVOKwU_Ijclijv1oFHDHDacjIgNt2pFE"
                        />
                        <div className="absolute bottom-3 right-3 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-mono font-bold">
                            00:01:54
                        </div>
                        <div className="absolute inset-0 bg-red-600/5 pointer-events-none border-4 border-red-500/20 rounded-xl"></div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">Nike Air Mag</h3>
                            <span className="text-slate-400 material-symbols-outlined cursor-pointer hover:text-red-500">
                                favorite
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-xs text-slate-500">42 ผู้ประมูลล่าสุด</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-red-500 mb-1 font-bold">ราคาสุดท้ายก่อนจบ</p>
                                    <p className="text-2xl font-bold text-slate-900">฿1,240,000</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-red-600 text-sm font-bold animate-bounce">
                                        <span className="material-symbols-outlined text-sm">bolt</span> New Bid!
                                    </div>
                                    <p className="text-[10px] text-slate-400">10 วินาทีที่แล้ว</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors">
                                ฿1,250,000
                            </button>
                            <button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                เสนอราคาด่วน
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-alt="High-end drone with camera"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUhO6WyoH5htukpWIdRmoXqgfZ6TXlWXCmGj7uEH2odrbSkD74bdhfGz9B87pEwZVJUMtmebmC5j4pYlThzrdRcglsX2afuEoI8DOVtDmjd58n4GnP3rRvP_3Ij-Orvu6-UNLkf1JclGhNtWiMuBh9RtSjV4IH9a0jrzUFNe6XyZ7yB9nT6ATD6wV-6Ge4HwCb6Ts70Q-N7uE9rVyElZFFhs5vdshtlUvvNawS0OdHLOMgjJQzkg_RB1J3JCIhHAPk4mwkj9bmrJg"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-mono">
                            03:15:22
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">
                                DJI Inspire 3 Cinema Drone
                            </h3>
                            <span className="text-slate-400 material-symbols-outlined cursor-pointer hover:text-red-500">
                                favorite
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-xs text-slate-500">5 ผู้ประมูลล่าสุด</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">ราคาปัจจุบัน</p>
                                    <p className="text-2xl font-bold text-slate-900">฿385,000</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400">บิดถัดไป</p>
                                    <p className="text-[10px] text-slate-400">+฿5,000</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors">
                                ฿390,000
                            </button>
                            <button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                เสนอราคาด่วน
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                    <div className="relative aspect-video overflow-hidden">
                        <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            data-alt="Modern abstract oil painting"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZT_uGjBeaH05BmS-Gx21C54o-Ome1LoMFp1wFaARBK1OQ7DEHKGgZwzGofQoaoxLsbyTqtVM1vLewoM2HwAsfb5frrNEBDUu0hqyd4kzfDitA3dC7MjMKVZsqinHlJqBJ_bfMSXBLU4EHyQOtijgJOrSrhdb8tEi9QiQDsxCm7l_Lsx-UGcWb5tIuoNmB0aq4-wKZD43edYUTNcBywCNtx8bevEICdpo5PoNB0p9DezGwteeZUnLuB_SPUd1Z6OPRsZgi-TulgYI"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm font-mono">
                            12:44:01
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight">Original Abstract</h3>
                            <span className="text-slate-400 material-symbols-outlined cursor-pointer hover:text-red-500">
                                favorite
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-xs text-slate-500">12 ผู้ประมูลล่าสุด</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">ราคาปัจจุบัน</p>
                                    <p className="text-2xl font-bold text-slate-900">฿54,200</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-primary text-sm font-bold">
                                        <span className="material-symbols-outlined text-sm">history</span> History
                                    </div>
                                    <p className="text-[10px] text-slate-400">88 บิดทั้งหมด</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm transition-colors">
                                ฿55,000
                            </button>
                            <button className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                                เสนอราคาด่วน
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 flex flex-col items-center">
                <button className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                    แสดงเพิ่มเติม
                    <span className="material-symbols-outlined">expand_more</span>
                </button>
                <p className="text-slate-400 text-sm mt-4">แสดงผล 6 จากทั้งหมด 248 รายการที่กำลังประมูล</p>
            </div>
        </main>
    );
}

export default Page;
