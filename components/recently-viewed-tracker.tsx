"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/stores/recently-viewed";

interface RecentlyViewedTrackerProps {
  product: {
    id: string;
    name: string;
    brand?: string | null;
    image_url: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    supplier?: {
      id: string;
      full_name: string | null;
    } | null;
    base_price?: number | null;
  };
}

export default function RecentlyViewedTracker({
  product,
}: RecentlyViewedTrackerProps) {
  const addProduct = useRecentlyViewedStore((state) => state.addProduct);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    addProduct({
      id: product.id,
      name: product.name,
      brand: product.brand || undefined,
      image_url: product.image_url,
      category: product.category || undefined,
      supplier: product.supplier
        ? {
            id: product.supplier.id,
            full_name: product.supplier.full_name || "Unknown Supplier",
          }
        : undefined,
      base_price: product.base_price || undefined,
    });
  }, [product, addProduct]);

  return null;
}
