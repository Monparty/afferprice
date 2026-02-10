import { Input } from "antd";

function InputText({ icon: Icon, placeholder = "", variant = undefined, size = "middle", className }) {
    return (
        <div>
            <Input
                placeholder={placeholder}
                variant={variant}
                prefix={Icon && <Icon className="opacity-20 me-2" />}
                size={size}
                className={`${className}`}
            />
        </div>
    );
}

export default InputText;
