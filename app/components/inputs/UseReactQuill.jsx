"use client";
import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useController } from "react-hook-form";
import UseHelperText from "./UseHelperText";

function UseReactQuill({ control, name, placeholder = "โปรดระบุข้อมูลที่นี่..." }) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({
        name,
        control,
        defaultValue: "",
    });

    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

        const quill = new Quill(editorRef.current, {
            theme: "snow",
            placeholder: placeholder,
            modules: {
                toolbar: [
                    [{ font: [] }, { size: [] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ header: 1 }, { header: 2 }],
                    ["link", "image", "video"],
                    [{ align: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                ],
            },
        });

        quillRef.current = quill;
        quill.on("text-change", () => {
            onChange(quill.root.innerHTML);
        });
    }, [onChange]);

    useEffect(() => {
        if (!quillRef.current) return;

        const currentHTML = quillRef.current.root.innerHTML;
        if (value !== currentHTML) {
            quillRef.current.root.innerHTML = value || "";
        }
    }, [value]);

    return (
        <div>
            <div ref={editorRef} className="min-h-60" />
            {error && <UseHelperText errorMessage={error.message} />}
        </div>
    );
}

export default UseReactQuill;
