import { Input } from "antd";
import React from "react";

function InputText({ icon: Icon, placeholder = "", variant = undefined }) {
    return (
        <div>
            <Input placeholder={placeholder} variant={variant} prefix={Icon && <Icon className="opacity-20 me-2" />} />
        </div>
    );
}

export default InputText;
