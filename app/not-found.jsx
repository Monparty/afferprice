"use client";
import React from "react";
import pageNotFound from "../public/images/pageNotFound.svg";
import Image from "next/image";
import UseButton from "./components/inputs/UseButton";
import { useRouter } from "next/navigation";

function NotFound() {
    const router = useRouter();
    return (
        <div className="h-dvh w-full flex flex-col justify-center items-center">
            <div className="relative w-full h-50 md:h-100 mb-4">
                <Image src={pageNotFound} fill alt="Page Not Found" />
            </div>
            <UseButton label="ย้อนกลับ" size="large" onClick={() => router.push("/")} />
        </div>
    );
}

export default NotFound;
