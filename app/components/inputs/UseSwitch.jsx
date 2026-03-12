import { Switch } from "antd";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

function UseSwitch({ control, name, label, onChange, defaultChecked, disabled = false }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="grid w-fit">
                    <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                        {label}
                    </label>
                    <Switch
                        {...field}
                        onChange={(value) => {
                            if (onChange === typeof "function") {
                                onChange(value);
                            }
                            field.onChange(value);
                        }}
                        defaultChecked={defaultChecked}
                        className="w-fit"
                        disabled={disabled}
                    />
                    {error && <UseHelperText errorMessage={error.message} />}
                </div>
            )}
        />
    );
}

export default UseSwitch;
