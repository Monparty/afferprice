import UseSkeleton from "@/app/components/utils/UseSkeleton";
import UseTabs from "@/app/components/utils/UseTabs";

function SellingTabs({ tabItems, setActiveTab, loading }) {
    if (loading) {
        return (
            <div className="grid gap-6">
                <UseSkeleton />
                <UseSkeleton />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 pb-6 overflow-x-auto">
                <UseTabs items={tabItems} size="large" onChange={(key) => setActiveTab(key)} />
            </div>
        </div>
    );
}

export default SellingTabs;
