"use client";
import { Image } from "antd";

function UseImageGroup({ imageGroup, alone = false, aloneWidth = "100%", aloneHeight = "100%" }) {
    if (!imageGroup?.length) return null;
    return (
        <Image.PreviewGroup>
            {alone ? (
                <>
                    {/* รูปที่โชว์จริง */}
                    <Image
                        src={imageGroup[0].src}
                        alt={imageGroup[0].alt}
                        width={aloneWidth}
                        height={aloneHeight}
                        className="rounded-xl object-cover!"
                        classNames={{
                            cover: "rounded-xl",
                        }}
                    />

                    {/* รูปที่ซ่อน แต่ไว้ให้ preview */}
                    {imageGroup?.slice(1).map((img, index) => (
                        <Image key={index} src={img.src} alt={img.alt} style={{ display: "none" }} />
                    ))}
                </>
            ) : (
                <div className="flex gap-4">
                    {imageGroup.map((image, index) => (
                        <Image
                            key={index}
                            width={image?.width}
                            height={image?.height}
                            src={image.src}
                            alt={image.alt}
                            className="rounded-lg border border-slate-200 object-cover!"
                            classNames={{
                                cover: "rounded-lg",
                            }}
                        />
                    ))}
                </div>
            )}
        </Image.PreviewGroup>
    );
}

export default UseImageGroup;
