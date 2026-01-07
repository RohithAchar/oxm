"use client";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ProductCard, ProductCardSkeleton } from "./product-card";

type Product = {
  id: string;
  name: string;
  brand: string;
  supplierName: string;
  imageUrl: string | null;
  priceAndQuantity: { id: string; price: number; quantity: number }[];
  dropshipPrice?: number;
  is_verified: boolean;
  hasSample: boolean;
  is_active: boolean;
};

interface InfiniteProductsGridProps {
  apiEndpoint: string;
  apiParams?: Record<string, string>;
  gridClassName?: string;
  pageSize?: number;
  initialItems?: Product[];
}

export function InfiniteProductsGrid({
  apiEndpoint,
  apiParams = {},
  gridClassName = "grid items-stretch auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2",
  pageSize = 12,
  initialItems = [],
}: InfiniteProductsGridProps) {
  const { items, loading, hasMore, loaderRef } = useInfiniteScroll<Product>({
    fetchFn: async (page: number) => {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...apiParams,
      });
      const res = await fetch(`${apiEndpoint}?${params}`);
      if (!res.ok) throw new Error("Failed to load products");
      const json = await res.json();
      const products: Product[] = json.products || [];
      
      // Transform prices from paise to rupees if needed
      const transformed = products.map((p) => ({
        ...p,
        priceAndQuantity: (p.priceAndQuantity || []).map((tier) => ({
          ...tier,
          price:
            typeof tier.price === "number"
              ? tier.price / 100
              : parseFloat(String(tier.price)) / 100,
        })),
        dropshipPrice: p.dropshipPrice
          ? typeof p.dropshipPrice === "number"
            ? p.dropshipPrice / 100
            : parseFloat(String(p.dropshipPrice)) / 100
          : undefined,
      }));

      return {
        items: transformed,
        hasMore: Boolean(json.hasMore) && transformed.length > 0,
      };
    },
    initialPage: initialItems.length > 0 ? 2 : 1,
    enabled: true,
    skipInitialFetch: initialItems.length > 0,
    rootMargin: "400px", // Increase root margin to trigger earlier
  });

  const allItems = [...initialItems, ...items];

  return (
    <>
      <div className={gridClassName}>
        {allItems.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            brand={product.brand}
            supplierName={product.supplierName}
            imageUrl={product.imageUrl}
            priceAndQuantity={product.priceAndQuantity}
            dropshipPrice={product.dropshipPrice}
            is_verified={product.is_verified}
            hasSample={product.hasSample}
            is_active={product.is_active}
          />
        ))}
      </div>

      {/* Loading indicator and infinite scroll trigger */}
      <div 
        ref={loaderRef} 
        className="min-h-[200px] py-6"
        aria-hidden="true"
      >
        {loading && (
          <div className={gridClassName}>
            {Array(pageSize)
              .fill(null)
              .map((_, idx) => (
                <ProductCardSkeleton key={`skeleton-${idx}`} />
              ))}
          </div>
        )}
        {!loading && !hasMore && allItems.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No products found
          </p>
        )}
        {!loading && !hasMore && allItems.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            All products loaded
          </p>
        )}
      </div>
    </>
  );
}

