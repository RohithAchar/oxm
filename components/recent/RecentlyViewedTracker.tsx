"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/stores/recentlyViewed";

type TrackerProps = {
  product: {
    id: string;
    name: string;
    product_images?: Array<{ image_url?: string | null }>;
    brand?: string | null;
    is_verified?: boolean | null;
    is_sample_available?: boolean | null;
    priceAndQuantity?: Array<{ quantity: number; price: number }>;
    supplier_name?: string | null;
  };
};

export default function RecentlyViewedTracker({ product }: TrackerProps) {
  const add = useRecentlyViewedStore((s) => s.add);

  useEffect(() => {
    if (!product?.id) return;
    const imageUrl =
      product.product_images?.find((i) => Boolean(i.image_url))?.image_url ||
      "/product-placeholder.png";
    add({
      id: product.id,
      name: product.name,
      imageUrl,
      brand: product.brand || undefined,
      supplierName: product.supplier_name || undefined,
      priceAndQuantity: product.priceAndQuantity,
      is_verified: !!product.is_verified || false,
      hasSample: !!product.is_sample_available || false,
    });
  }, [add, product]);

  return null;
}


