"use client";
import Form from "../../components/Form";
import { useParams } from "next/navigation";

function Page({ params }) {
    const { id } = useParams();
    return (
        <div>
            user edit {id}
            <Form id={id} />
        </div>
    );
}

export default Page;
