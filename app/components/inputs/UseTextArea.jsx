import React from "react";
import { Input } from "antd";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

const { TextArea } = Input;
function UseTextArea({
    control,
    name,
    label = "",
    onChange,
    placeholder = "",
    className,
    size = "middle",
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
                    <TextArea
                        {...field}
                        id={label}
                        placeholder={label && !placeholder ? `โปรดระบุ ${label}` : placeholder}
                        size={size}
                        className={`w-full ${className}`}
                        onChange={(value) => {
                            if (typeof onChange === "function") {
                                onChange(value);
                            }
                            field.onChange(value);
                        }}
                        disabled={disabled}
                        status={error ? "error" : undefined}
                        autoSize={{ minRows: 4, maxRows: 8 }}
                    />
                    {error && <UseHelperText errorMessage={error.message} />}
                </div>
            )}
        />
    );
}

export default UseTextArea;
