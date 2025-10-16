"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type TierPricing = { id: string; price: number; quantity: number };
type Card = {
  id: string;
  imageUrl: string | null;
  description: string | null;
  isSampleAvailable: boolean;
  name: string;
  supplierName: string;
  tierPricing: TierPricing[];
  isSupplierVerified: boolean;
};

const CardView = ({
  id,
  imageUrl,
  description,
  isSampleAvailable,
  name,
  supplierName,
  tierPricing,
  isSupplierVerified,
}: Card) => {
  const [imgSrc, setImgSrc] = useState<string>(
    imageUrl || "/product-placeholder.png"
  );
  const priceText = (() => {
    if (!tierPricing || tierPricing.length === 0) return null;
    const prices = tierPricing.map((t) => t.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (tierPricing.length > 1 && min !== max) {
      return `₹${(min / 100).toFixed(2)} - ₹${(max / 100).toFixed(2)}`;
    }
    return `₹${(prices[0] / 100).toFixed(2)}`;
  })();
  const minOrderQty = (() => {
    if (!tierPricing || tierPricing.length === 0) return null;
    const quantities = tierPricing.map((t) => t.quantity);
    return Math.min(...quantities);
  })();

  return (
    <Link
      href={`/products/${id}`}
      className="rounded-lg relative overflow-hidden p-2 bg-muted"
    >
      <div className="w-full aspect-square rounded-md overflow-hidden relative">
        <Image
          fill
          className="object-cover"
          src={imgSrc}
          alt={description || name}
          onError={() => setImgSrc("/product-placeholder.png")}
        />
        {isSampleAvailable && (
          <Badge
            variant="secondary"
            className="text-[10px] px-2 py-0.5 leading-none z-20 absolute right-2 top-2"
          >
            Sample
          </Badge>
        )}
      </div>
      <p className="text-sm line-clamp-2">{name}</p>
      <span className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">{supplierName}</p>
        {isSupplierVerified && (
          <Badge
            variant="secondary"
            className="text-[9px] px-1.5 py-0.5 leading-none flex-shrink-0 bg-blue-50 text-blue-700 border-blue-200"
          >
            <BadgeCheckIcon className="h-2 w-2 mr-0.5" />
            Verified
          </Badge>
        )}
      </span>
      {tierPricing && tierPricing.length > 0 && (
        <>
          <p className="font-bold my-1">{priceText}</p>
          <p className="text-muted-foreground text-xs">
            Min. order {minOrderQty}
          </p>
        </>
      )}
    </Link>
  );
};

export default function JustForYouInfinite() {
  const [items, setItems] = useState<Card[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const limit = 4;

  const fetchPage = async (nextPage: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/home-products?page=${nextPage}&limit=${limit}`
      );
      if (!res.ok) throw new Error("Failed to load products");
      const json = await res.json();
      const newItems: Card[] = json.products || [];
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length === limit);
      setPage(nextPage);
    } catch (e) {
      setHasMore(false);
      // optional: console.error(e)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {items.map((p) => (
          <CardView key={p.id} {...p} />
        ))}
      </div>
      <div ref={loaderRef} className="py-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg relative overflow-hidden p-2 bg-muted"
              >
                <div className="w-full aspect-square rounded-md overflow-hidden relative">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="mt-2 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hasMore ? (
          ""
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No products found
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
