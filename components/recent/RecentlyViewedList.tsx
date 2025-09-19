"use client";

import { useMemo } from "react";
import { useRecentlyViewedStore } from "@/stores/recentlyViewed";
import { ProductCard } from "@/components/home/product-card";

export default function RecentlyViewedList() {
  const items = useRecentlyViewedStore((s) => s.items);

  const products = useMemo(
    () =>
      items
        .filter(
          (p) =>
            p && p.id && p.name && !/footer/i.test((p.name || "").toString())
        )
        .slice(0, 12),
    [items]
  );

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-6 md:mt-10">
      <div className="rounded-2xl border bg-muted/30 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="w-full text-left">
            <h2 className="text-foreground text-2xl md:text-3xl font-medium tracking-wide mb-1">
              Recently viewed
            </h2>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off
            </p>
          </div>
        </div>
        <div className="grid items-stretch auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              brand={p.brand || ""}
              supplierName={p.supplierName || p.brand || "Supplier"}
              imageUrl={p.imageUrl}
              priceAndQuantity={p.priceAndQuantity || []}
              is_verified={p.is_verified || false}
              hasSample={p.hasSample || false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
