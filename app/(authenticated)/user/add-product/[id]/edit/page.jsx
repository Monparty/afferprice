"use client";
import { useParams } from "next/navigation";
import AddProductLayout from "../../components/AddProductLayout";

function Page() {
    const { id } = useParams();
    return <AddProductLayout productId={id} />;
}

export default Page;
