"use client";
import { Radio } from "antd";
import { Controller } from "react-hook-form";

function UseRadio({ control, name, options, onChange, label, className, defaultValue }) {
    if (!options?.length) return null;
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div>
                    <Radio.Group
                        onChange={(e) => {
                            if (typeof onChange === "function") {
                                onChange(e.target.value);
                            }
                            field.onChange(e.target.value);
                        }}
                        vertical
                        className={`${className}`}
                        options={options}
                        defaultValue={defaultValue}
                    />
                    {label}
                </div>
            )}
        />
    );
}

export default UseRadio;
