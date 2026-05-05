"use client";
import { AutoComplete } from "antd";
import { useState } from "react";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

function UseAutoComplete({
    control,
    name,
    label = "",
    onChange,
    placeholder = "",
    className,
    icon: Icon,
    variant = undefined,
    size = "middle",
    disabled = false,
    onPressEnter,
    fetchOptions,
    onSelectOption,
    popupWidth,
}) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (text) => {
        if (!fetchOptions || !text) {
            setOptions([]);
            return;
        }
        setLoading(true);
        const result = await fetchOptions(text);
        setOptions(result);
        setLoading(false);
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                return (
                    <div className="grid w-full">
                        <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                            {label}
                        </label>
                        <AutoComplete
                            {...field}
                            id={label}
                            placeholder={label && !placeholder ? `โปรดระบุ ${label}` : placeholder}
                            variant={variant}
                            prefix={Icon && <Icon className="opacity-20 me-2" />}
                            size={size}
                            optionLabelProp="value" // เมื่อเลือกแล้วนำ value ไปแสดงใน input
                            options={options}
                            onSearch={handleSearch}
                            onSelect={(value, option) => {
                                field.onChange(value);
                                onSelectOption?.(value, option);
                            }}
                            className={`w-full ${className} max-w-50`}
                            onChange={(value) => {
                                field.onChange(value);
                                onChange?.(value);
                            }}
                            disabled={disabled}
                            status={error ? "error" : undefined}
                            onKeyDown={(e) => e.key === "Enter" && onPressEnter?.()}
                            popupMatchSelectWidth={popupWidth ?? true}
                            notFoundContent={loading ? "กำลังค้นหา..." : null}
                        />
                        {error && <UseHelperText errorMessage={error.message} />}
                    </div>
                );
            }}
        />
    );
}

export default UseAutoComplete;
