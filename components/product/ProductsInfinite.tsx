"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/home/product-card";

type Product = {
  id: string;
  imageUrl: string | null;
  name: string;
  brand: string;
  supplierName: string;
  priceAndQuantity: { id: string; price: number; quantity: number }[];
  is_verified: boolean;
  is_sample_available: boolean;
  is_active: boolean;
};

export default function ProductsInfinite({
  initialQueryString,
}: {
  initialQueryString: string;
}) {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const pageSize = 24;

  const fetchPage = async (nextPage: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = `/api/infinite-products?${initialQueryString}&page=${nextPage}&page_size=${pageSize}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load products");
      const json = await res.json();
      const newItems: Product[] = json.products || [];
      const transformed: Product[] = newItems.map((p) => ({
        ...p,
        priceAndQuantity: (p.priceAndQuantity || []).map((t) => ({
          ...t,
          price:
            typeof t.price === "number" ? t.price / 100 : Number(t.price) / 100,
        })),
      }));
      setItems((prev) => [...prev, ...transformed]);
      setHasMore(Boolean(json.hasMore) && newItems.length > 0);
      setPage(nextPage);
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueryString]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchPage(page + 1);
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  return (
    <div className="space-y-6">
      <div className="grid items-stretch auto-rows-fr gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            imageUrl={p.imageUrl}
            name={p.name}
            brand={p.brand || ""}
            supplierName={p.supplierName}
            priceAndQuantity={p.priceAndQuantity || []}
            is_verified={p.is_verified || false}
            hasSample={p.is_sample_available || false}
            is_active={p.is_active}
          />
        ))}
      </div>

      <div className="py-6" ref={loaderRef}>
        {!loading && !hasMore && items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
