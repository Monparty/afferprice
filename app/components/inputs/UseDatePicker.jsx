import { DatePicker } from "antd";
import React from "react";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

function UseDatePicker({
    control,
    name,
    label = "",
    onChange,
    placeholder = "",
    variant = undefined,
    size = "middle",
    type = undefined,
    disabled = false,
}) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="grid w-full">
                    <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                        {label}
                    </label>
                    <DatePicker
                        {...field}
                        id={label}
                        type={type}
                        placeholder={label && !placeholder ? `โปรดระบุ ${label}` : placeholder}
                        variant={variant}
                        size={size}
                        className={`w-full h-fit`}
                        onChange={(value) => {
                            if (typeof onChange === "function") {
                                onChange(value);
                            }
                            field.onChange(value);
                        }}
                        disabled={disabled}
                        status={error ? "error" : undefined}
                    />
                    {error && <UseHelperText errorMessage={error.message} />}
                </div>
            )}
        />
    );
}

export default UseDatePicker;
