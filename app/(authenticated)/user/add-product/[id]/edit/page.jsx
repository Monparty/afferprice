"use client";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AddProductLayout from "../../components/AddProductLayout";

function EditContent() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const step = Number(searchParams.get("step")) || 0;
    return <AddProductLayout productId={id} initialStep={step} />;
}

function Page() {
    return (
        <Suspense>
            <EditContent />
        </Suspense>
    );
}

export default Page;
