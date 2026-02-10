"use client";
import { InputNumber as AntInputNumber } from "antd";

function InputNumber({
    icon: Icon,
    placeholder = "",
    variant = undefined,
    size = "middle",
    min = 1,
    max = undefined,
    className,
    format = false,
    step = false,
}) {
    const formatter = (value) => {
        const [start, end] = `${value}`.split(".") || [];
        const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `฿ ${end ? `${v}.${end}` : `${v}`}`;
    };

    /*
        formatter   จัด format ตอนแสดง (ใส่ ฿, ใส่ ,)
        parser      แกะ format ออกให้เหลือเลขล้วน
        step        กำหนดความละเอียดในการเพิ่ม/ลด
    */
    return (
        <div>
            <AntInputNumber
                placeholder={placeholder}
                variant={variant}
                style={{ width: "100%" }}
                size={size}
                min={min}
                max={max}
                prefix={Icon && <Icon className="opacity-20 me-2" />}
                formatter={format ? formatter : null}
                step={step ? "0.01" : null}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                className={`${className}`}
            />
        </div>
    );
}

export default InputNumber;
