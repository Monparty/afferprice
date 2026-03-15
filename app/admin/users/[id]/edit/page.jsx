"use client";
import Form from "../../components/Form";
import { useParams } from "next/navigation";

function Page() {
    const { id } = useParams();
    return <Form mode="edit" id={id} />;
}

export default Page;
