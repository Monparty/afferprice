import { Segmented } from "antd";
import UseHelperText from "./UseHelperText";
import { Controller } from "react-hook-form";

function UseSegmented({ control, name, label, options, onChange }) {
    if (!options?.length) return null;
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <div className="grid w-fit">
                    <label htmlFor={label} className="text-sm mb-0.5 w-fit">
                        {label}
                    </label>
                    <Segmented
                        {...field}
                        options={options}
                        onChange={(value) => {
                            if (onChange === typeof "function") {
                                onChange(value);
                            }
                            field.onChange(value);
                        }}
                        classNames={{
                            root: "py-1!",
                            item: "mx-1!",
                        }}
                        size="large"
                    />
                    {error && <UseHelperText errorMessage={error.message} />}
                </div>
            )}
        />
    );
}

export default UseSegmented;
