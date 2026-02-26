"use client";
import { Controller } from "react-hook-form";
import UseHelperText from "./UseHelperText";

function UseSelectCard({ control, name, options, type = "radio", dot = false }) {
    // type = radio || checkbox
    if (!options?.length) return null;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <>
                    {options.map((item, index) => {
                        const id = `${name}-${index}`;
                        const value = item.value ?? item.label;

                        // สลับ radio / checkbox
                        const isRadio = type === "radio";
                        const isChecked = isRadio ? field.value === value : field.value?.includes(value);
                        const handleChange = (e) => {
                            if (isRadio) {
                                field.onChange(value);
                            } else {
                                const checked = e.target.checked;
                                const newValue = checked
                                    ? [...(field.value || []), value]
                                    : (field.value || []).filter((v) => v !== value);
                                field.onChange(newValue);
                            }
                        };
                        return (
                            <label
                                key={id}
                                htmlFor={id}
                                className={`flex justify-center h-28 w-full p-5 border rounded-lg cursor-pointer ${
                                    isChecked
                                        ? "border-2 border-orange-600 bg-orange-50 text-gray-800"
                                        : "border-orange-100 border-2 bg-white text-gray-500"
                                }`}
                            >
                                <input
                                    id={id}
                                    name={name}
                                    className="hidden"
                                    value={value}
                                    type={type}
                                    checked={isChecked}
                                    onChange={handleChange}
                                />
                                <div className="flex flex-col justify-center items-center gap-1">
                                    {dot && (
                                        <div className="h-4 w-4 bg-white rounded-full flex justify-center items-center shadow">
                                            <div
                                                className={` h-2 w-2 rounded-full shadow ${
                                                    isChecked ? "bg-orange-600" : "bg-gray-300"
                                                }`}
                                            ></div>
                                        </div>
                                    )}
                                    <div className="text-sm font-semibold">{item.label}</div>
                                    {item.subTitle && <div className="text-xs">{item.subTitle}</div>}
                                </div>
                            </label>
                        );
                    })}
                    {error && <UseHelperText errorMessage={error.message} />}
                </>
            )}
        />
    );
}

export default UseSelectCard;
