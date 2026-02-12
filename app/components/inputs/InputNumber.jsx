"use client";
import { InputNumber as AntInputNumber, ConfigProvider } from "antd";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";
import { volcano } from "@ant-design/colors";


function InputNumber({
    control,
    name,
    label = "\u00A0",
    onChange,
    placeholder = "",
    className,
    icon: Icon,
    // variant = undefined,
    variant = "filled",
    size = "middle",
    min = 1,
    max = undefined,
    step = false,
    format = false,
}) {
    const formatter = (value) => {
        const [start, end] = `${value}`.split(".") || [];
        const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // return `฿ ${end ? `${v}.${end}` : `${v}`}`;
        return `${end ? `${v}.${end}` : `${v}`}`;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: volcano[2],
                        },
                    }}
                >
                    <div className="grid w-full relative">
                        <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                            {label}
                        </label>
                        <AntInputNumber
                            {...field}
                            id={label}
                            placeholder={label && !placeholder ? `โปรดระบุ ${label}` : placeholder}
                            variant={variant}
                            size={size}
                            min={min}
                            max={max}
                            prefix={Icon && <Icon className="opacity-20 me-2" />}
                            className={`w-full! ${className}`}
                            onChange={(value) => {
                                if (typeof onChange === "function") {
                                    onChange(value);
                                }
                                field.onChange(value);
                            }}
                            parser={(value) => value?.replace(/\$\s?|(,*)/g, "")} // แกะ format ออกให้เหลือเลขล้วน
                            step={step ? "0.01" : undefined} // กำหนดความละเอียดในการเพิ่ม/ลด
                            formatter={format ? formatter : undefined} // จัด format ตอนแสดง (ใส่ ฿, ใส่ ,)
                            status={error ? "error" : undefined}
                        />
                        {error && <UseHelperText errorMessage={error.message} />}
                    </div>
                </ConfigProvider>
            )}
        />
    );
}

export default InputNumber;
