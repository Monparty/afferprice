import { Checkbox, ConfigProvider } from "antd";
import { Controller } from "react-hook-form";
import { volcano } from "@ant-design/colors";

function UseCheckbox({ control, name, onChange, label, className }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: volcano[5],
                        },
                    }}
                >
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
                </ConfigProvider>
            )}
        />
    );
}

export default UseCheckbox;
