import { Checkbox } from "antd";
import { Controller } from "react-hook-form";

function UseCheckbox({ control, name, onChange, label, className }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <Checkbox
                    {...field}
                    onChange={(e) => {
                        if (typeof onChange === "function") {
                            onChange(e);
                        }
                        field.onChange(e);
                    }}
                    className={`${className}`}
                >
                    {label}
                </Checkbox>
            )}
        />
    );
}

export default UseCheckbox;
