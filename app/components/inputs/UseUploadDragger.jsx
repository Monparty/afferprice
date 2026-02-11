"use client";
import Dragger from "antd/es/upload/Dragger";
import UseButton from "./UseButton";
import { CloudUploadOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import { message } from "antd";

function UseUploadDragger({ control, name, multiple = false, maxCount = 8 }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const { value, ...restField } = field;
                return (
                    <Dragger
                        // {...field}
                        // {...restField}
                        // fileList={value}
                        multiple={multiple}
                        listType="picture-card"
                        classNames={{
                            list: "mt-6! gap-4!",
                        }}
                        maxCount={maxCount}
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                        onChange={(info) => {
                            const { status } = info.file;
                            if (status !== "uploading") {
                                // console.log("info.file", info.file);
                                // console.log("info.fileList", info.fileList);
                                field.onChange(info.fileList);
                            }
                            if (status === "done") {
                                message.success(`${info.file.name} file uploaded successfully.`);
                            } else if (status === "error") {
                                message.error(`${info.file.name} file upload failed.`);
                            }
                        }}
                        onDrop={(e) => {
                            if (typeof onDrop === "function") {
                                onDrop(e);
                            }
                        }}
                    >
                        <div className="w-full flex flex-col justify-center items-center space-y-4 p-4">
                            <div className="w-16 h-16 flex justify-center items-center bg-orange-100 rounded-full">
                                <CloudUploadOutlined className="text-3xl text-orange-600!" />
                            </div>
                            <p className="text-xl font-bold">ลากและวางรูปภาพลงที่นี่</p>
                            <p className="text-base">
                                อัปโหลดรูปภาพได้สูงสุด {maxCount} รูป โดยรองรับไฟล์นามสกุล JPEG, PNG
                            </p>
                            <UseButton label="เลือกไฟล์จากเครื่อง" size="large" />
                            {/* {error && <>{error.message}</> */}
                        </div>
                    </Dragger>
                );
            }}
        />
    );
}

export default UseUploadDragger;
