"use client";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

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
                <div className="grid w-full relative">
                    <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                        {label}
                    </label>
                    <Select
                        {...field}
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
                    />
                    {error && <UseHelperText errorMessage={error.message} />}
                </div>
            )}
        />
    );
}

export default UseSelect;
