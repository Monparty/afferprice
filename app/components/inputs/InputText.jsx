"use client";
import { Input } from "antd";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

function InputText({
    control,
    name,
    label = "",
    onChange,
    placeholder = "",
    className,
    icon: Icon,
    variant = undefined,
    size = "middle",
    type = undefined,
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
                    <Input
                        {...field}
                        id={label}
                        type={type}
                        placeholder={label && !placeholder ? `โปรดระบุ ${label}` : placeholder}
                        variant={variant}
                        prefix={Icon && <Icon className="opacity-20 me-2" />}
                        size={size}
                        className={`w-full ${className}`}
                        onChange={(value) => {
                            if (typeof onChange === "function") {
                                onChange(value);
                            }
                            field.onChange(value);
                        }}
                        status={error ? "error" : undefined}
                    />
                    {error && <UseHelperText errorMessage={error.message} />}
                </div>
            )}
        />
    );
}

export default InputText;
