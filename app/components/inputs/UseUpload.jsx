"use client";
import Dragger from "antd/es/upload/Dragger";
import UseButton from "./UseButton";
import { CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";
import { useState } from "react";

function UseUpload({
    control,
    name,
    customRequest,
    onRemove,
    fileList,
    multiple = false,
    maxCount = 1,
    label,
    isDrag = false,
    title,
    textFileType = "PNG/JPG",
    textFileSize = "ขนาดไฟล์ไม่เกิน 2MB",
    acceptVideo = false,
    disabled = false,
}) {
    const [fileListData, setFileListData] = useState([]);
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <div className="w-full">
                        <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                            {label}
                        </label>
                        <Dragger
                            multiple={multiple}
                            id={label}
                            fileList={field.value || []}
                            listType="picture-card"
                            classNames={{
                                list: `${isDrag ? "mt-4!" : "mt-2!"} gap-4! object-fill!`,
                            }}
                            maxCount={maxCount}
                            customRequest={(options) => customRequest({ options, fileListData })}
                            onRemove={(file) => {
                                const updated = (field.value || []).filter((f) => f.uid !== file.uid);
                                field.onChange(updated);
                                onRemove?.(file);
                            }}
                            onChange={({ fileList }) => setFileListData(fileList)}
                            accept={acceptVideo ? "video/*" : "image/*"}
                            disabled={disabled}
                        >
                            {isDrag ? (
                                <div className="w-full flex flex-col justify-center items-center gap-4 p-6">
                                    <div className="w-16 h-16 flex justify-center items-center bg-orange-100 rounded-full">
                                        <CloudUploadOutlined className="text-3xl text-orange-600!" />
                                    </div>
                                    <p className="text-xl font-bold">{title}</p>
                                    <div className="text-sm grid gap-1 text-[#c7c7c7]">
                                        <p>อัปโหลดรูปภาพได้สูงสุด {maxCount} รายการ</p>
                                        <p>
                                            {textFileType} {textFileSize}
                                        </p>
                                    </div>
                                    <UseButton label="เลือกไฟล์จากเครื่อง" size="large" />
                                    {error && <UseHelperText errorMessage={error.message} />}
                                </div>
                            ) : (
                                <div className="p-2 flex justify-start items-center gap-2">
                                    <div className="bg-slate-300 rounded-sm h-5 w-5 flex items-center justify-center">
                                        <UploadOutlined className="text-white! text-xs" />
                                    </div>
                                    <p className="text-[#c7c7c7]">
                                        แนบเอกสาร{" "}
                                        <span className="text-xs">
                                            ({textFileType} {textFileSize})
                                        </span>
                                    </p>
                                </div>
                            )}
                        </Dragger>
                    </div>
                );
            }}
        />
    );
}

export default UseUpload;
