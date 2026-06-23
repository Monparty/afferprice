"use client";

function PaymentMethodCard({ icon: Icon, title, subtitle, children }) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
                <Icon className="text-2xl! text-orange-500!" />
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

export default PaymentMethodCard;
