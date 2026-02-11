"use client";
import React from "react";
import InputNumber from "../components/inputs/InputNumber";
import InputText from "../components/inputs/InputText";
import { useForm } from "react-hook-form";
import UseButton from "../components/inputs/UseButton";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./schema";

function Page() {
    const { handleSubmit, watch, control } = useForm({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });
    // console.log("watch", watch());

    const handleLogin = (values) => {
        console.log("values", values);
    };
    return (
        <form className=" flex flex-col w-1/2 items-end gap-5" onSubmit={handleSubmit(handleLogin)}>
            {/* "outlined" | "borderless" | "filled" | "underlined" | undefined */}
            <InputText control={control} name="fname" label="ไม่มี" />
            <InputText control={control} name="1" label=" '' " variant />
            <InputText control={control} name="2" label="outlined" variant="outlined" />
            <InputText control={control} name="3" label="borderless" variant="borderless" />
            <InputText control={control} name="4" label="filled" variant="filled" />
            <InputText control={control} name="5" label="underlined" variant="underlined" />
            ===
            <InputNumber control={control} name="age" label="อายุ" onChange={(value) => console.log("value age", value)} />
            <UseButton label="submit" htmlType="submit" />
        </form>
    );
}

export default Page;
