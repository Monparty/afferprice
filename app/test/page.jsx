"use client";
import { useForm } from "react-hook-form";
import UseButton from "../components/inputs/UseButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";
import UseTable from "../components/utils/UseTable";
import UseImage from "../components/utils/UseImage";
import UseTag from "../components/utils/UseTag";
import { FieldTimeOutlined, MoreOutlined } from "@ant-design/icons";

function Page() {
    const { handleSubmit, watch, control } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });
    // console.log("watch", watch());

    const handleLogin = (values) => {
        console.log("values", values);
    };
    return <></>;
}

export default Page;
