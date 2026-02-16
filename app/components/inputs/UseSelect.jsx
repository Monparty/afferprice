"use client";
import { ConfigProvider, Select } from "antd";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";
import { volcano } from "@ant-design/colors";

function UseSelect({
    control,
    name,
    label = "",
    onChange,
    placeholder = "",
    className,
    variant = undefined,
    size = "middle",
    options,
    isMultiple = false,
}) {
    if (!options?.length) return null;
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
                        <Select
                            {...field}
                            allowClear
                            placeholder={label && !placeholder ? `โปรดระบุ ${label}` : placeholder}
                            size={size}
                            mode={isMultiple ? "multiple" : undefined}
                            className={`w-full ${className}`}
                            variant={variant}
                            onChange={(value) => {
                                if (typeof onChange === "function") {
                                    onChange(value);
                                }
                                field.onChange(value);
                            }}
                            options={options}
                            status={error ? "error" : undefined}
                        />
                        {error && <UseHelperText errorMessage={error.message} />}
                    </div>
                </ConfigProvider>
            )}
        />
    );
}

export default UseSelect;
