import { Image } from "antd";

function UseImage({ width, height, alt, src, className }) {
    return (
        <Image
            width={width}
            height={height}
            alt={alt}
            src={src}
            className={`${className} rounded-lg border border-slate-200 object-cover`}
            classNames={{
                cover: "rounded-lg",
            }}
        />
    );
}

export default UseImage;
