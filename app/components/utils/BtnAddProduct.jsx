import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";

function BtnAddProduct() {
    return (
        <div className="fixed top-22 -right-24 hover:right-0 transition-all">
            <Link
                href="/user/add-product"
                className="w-fit h-12 /rounded-full bg-orange-600 flex gap-4 items-center p-4 rounded-l-full"
            >
                <PlusOutlined className="text-white! text-lg" />
                <p className="text-white! font-semibold text-nowrap">โพสต์ขาย</p>
            </Link>
        </div>
    );
}

export default BtnAddProduct;
