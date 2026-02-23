"use client";
import { Input } from "antd";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

function UseInputPassword({
    control,
    name,
    label = "",
    placeholder = "",
    className,
    variant = undefined,
    size = "middle",
}) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="grid w-full relative">
                    <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                        {label}
                    </label>
                    <Input.Password
                        {...field}
                        id={label}
                        placeholder={label && !placeholder ? `โปรดระบุ ${label}` : placeholder}
                        variant={variant}
                        size={size}
                        className={`w-full ${className}`}
                        onChange={(value) => {
                            field.onChange(value);
                        }}
                        visibilityToggle={true}
                        status={error ? "error" : undefined}
                    />
                    {error && <UseHelperText errorMessage={error.message} />}
                </div>
            )}
        />
    );
}

export default UseInputPassword;
