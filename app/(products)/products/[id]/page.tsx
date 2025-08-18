import { ProductView } from "@/components/product/product-view";
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
      title: "Product not found",
      description: "This product is not available.",
    };
  }

  return {
    title: `${data.name} | My Marketplace`,
    description: data.description?.slice(0, 160),
    openGraph: {
      title: data.name,
      description: data.description,
      images: data.product_images?.map((img) => img.image_url) || [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductView id={id} />;
}
