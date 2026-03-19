"use client";
import CardHighlight from "@/app/components/utils/CardHighlight";
import DetailSearchBox from "@/app/components/utils/DetailSearchBox";
import UsePagination from "@/app/components/utils/UsePagination";

function Page() {
    return (
        <main className="flex gap-6">
            <div className="h-fit w-1/4 sticky top-12">
                <DetailSearchBox />
            </div>
            <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <CardHighlight />
                    <CardHighlight />
                    <CardHighlight />
                    <CardHighlight />
                    <CardHighlight />
                </div>
                <div className="mt-12">
                    <UsePagination />
                </div>
            </div>
        </main>
    );
}

export default Page;
