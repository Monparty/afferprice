import { createClient } from "@supabase/supabase-js";
import Script from "next/script";
import ProductDetail from "./ProductDetail";

async function getProductMeta(id) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { data } = await supabase
        .from("products")
        .select("title, description, start_price, images_url")
        .eq("id", id)
        .single();
    return data;
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProductMeta(id);
    if (!product) return { title: "สินค้าไม่พบ" };

    const image = product.images_url?.[0]?.url;
    const price = Number(product.start_price).toLocaleString("th-TH");

    return {
        title: product.title,
        description: `ประมูล ${product.title} — ราคาเริ่มต้น ฿${price} | Afferprice`,
        openGraph: {
            title: product.title,
            description: `ประมูล ${product.title} ราคาเริ่มต้น ฿${price}`,
            images: image ? [{ url: image, width: 800, height: 600, alt: product.title }] : [],
            type: "website",
        },
        alternates: {
            canonical: `https://www.afferprice.com/product/${id}`,
        },
    };
}

export default async function Page({ params }) {
    const { id } = await params;
    const product = await getProductMeta(id);

    const schemas = product
        ? [
              {
                  "@context": "https://schema.org",
                  "@type": "Product",
                  name: product.title,
                  description: product.description,
                  image: product.images_url?.map((i) => i.url) ?? [],
                  offers: {
                      "@type": "Offer",
                      url: `https://www.afferprice.com/product/${id}`,
                      priceCurrency: "THB",
                      price: product.start_price,
                      availability: "https://schema.org/InStock",
                      seller: { "@type": "Organization", name: "Afferprice" },
                  },
              },
              {
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: [
                      { "@type": "ListItem", position: 1, name: "หน้าหลัก", item: "https://www.afferprice.com" },
                      { "@type": "ListItem", position: 2, name: "สินค้า", item: "https://www.afferprice.com/categories" },
                      { "@type": "ListItem", position: 3, name: product.title, item: `https://www.afferprice.com/product/${id}` },
                  ],
              },
          ]
        : null;

    return (
        <>
            {schemas?.map((schema, i) => (
                <Script
                    key={i}
                    id={`schema-${i}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <ProductDetail />
        </>
    );
}
