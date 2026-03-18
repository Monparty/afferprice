"use client";
import { Checkbox } from "antd";
import { Controller } from "react-hook-form";

function UseCheckbox({ control, name, onChange, label, className, checked = false }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Checkbox
                    onChange={(e) => {
                        if (typeof onChange === "function") {
                            onChange(e.target.checked);
                        }
                        field.onChange(e.target.checked);
                    }}
                    className={`${className}`}
                    checked={checked}
                >
                    {label}
                </Checkbox>
            )}
        />
    );
}

export default UseCheckbox;
