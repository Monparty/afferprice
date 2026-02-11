"use client";
import { PlusOutlined } from "@ant-design/icons";
import UseUploadDragger from "../components/inputs/UseUploadDragger";
import { useForm } from "react-hook-form";

function Page() {
    const { handleSubmit, watch, control } = useForm({
        // resolver: yupResolver(schema),
        // mode: "onBlur",
    });
    // console.log("watch", watch());

    //

    console.log("watch", watch("myFile"));

    return (
        <>
            <UseUploadDragger control={control} name="myFile" multiple maxCount={3} />
        </>
    );
}

export default Page;
