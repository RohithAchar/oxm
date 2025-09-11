import ProductViewV2 from "@/components/product/product-view-v2";
import { getProductByIdCached } from "@/lib/controller/product/productOperations";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getProductByIdCached(id);

  if (!data) {
    return {
      title: "Product not found | OpenXmart",
      description: "This product is not available on OpenXmart.",
    };
  }

  return {
    title: `${data.name} | OpenXmart`,
    description: data.description?.slice(0, 160) || "Explore product details, specifications, and ordering options on OpenXmart.",
    openGraph: {
      title: `${data.name} | OpenXmart`,
      description: data.description || undefined,
      images: (data.product_images?.map((img) => img.image_url).filter(Boolean) as string[]) || [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.name} | OpenXmart`,
      description: data.description?.slice(0, 200) || "Explore product details on OpenXmart.",
      // images: same as OG
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductViewV2 id={id} />;
}
