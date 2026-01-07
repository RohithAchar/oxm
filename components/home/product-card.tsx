"use client";

import React from "react";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { BadgeCheckIcon, Eye } from "lucide-react";
import { Badge } from "../ui/badge";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  supplierName: string;
  imageUrl: string | null;
  priceAndQuantity: any[];
  dropshipPrice?: number;
  is_verified: boolean;
  verificationYears?: number;
  hasSample?: boolean;
  is_active?: boolean | null;
}

export const ProductCard = ({
  id,
  name,
  brand,
  supplierName,
  imageUrl,
  priceAndQuantity,
  dropshipPrice,
  is_verified,
  verificationYears,
  hasSample,
  is_active = true,
}: ProductCardProps) => {
  const searchParams = useSearchParams();
  const keepDropship = searchParams.get("dropship_available") === "true";
  const [imgSrc, setImgSrc] = useState<string>(
    imageUrl || "/product-placeholder.png"
  );
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatPriceRange = (values: any[]) => {
    if (!values || values.length === 0) return null;
    const prices = values
      .map((v) =>
        typeof v?.price === "number" ? v.price : parseFloat(v?.price)
      )
      .filter((n) => Number.isFinite(n)) as number[];
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
    if (min === max) return `₹${fmt.format(min)}`;
    return `₹${fmt.format(min)} – ₹${fmt.format(max)}`;
  };

  const formatSinglePrice = (value?: number | null) => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return null;
    }
    const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
    return `₹${fmt.format(value as number)}`;
  };

  const formatSoldCount = (count?: number) => {
    if (!count) return null;
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k sold`;
    }
    return `${count.toLocaleString()} sold`;
  };

  return (
    <Link
      href={`/products/${id}${keepDropship ? "?dropship_available=true" : ""}`}
      className="block h-full group"
      aria-label={`View details for ${name} from ${supplierName}`}
    >
      <div
        key={id}
        className={`rounded-lg relative isolate bg-white dark:bg-card h-full overflow-hidden cursor-pointer flex flex-col border border-border/50 ${
          !is_active ? "opacity-75" : ""
        }`}
      >
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted/30">
          {imageLoading && (
            <div className="absolute inset-0 animate-pulse bg-muted/50" />
          )}
          <Image
            fill
            src={imageError ? "/product-placeholder.png" : imgSrc}
            alt={name ? `${name} product image` : "Product image"}
            onError={() => setImageError(true)}
            onLoadingComplete={() => setImageLoading(false)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
            className="object-cover"
          />

          {/* Badges overlay on image - bottom left */}
          <div className="absolute top-2 right-2 z-20 flex flex-col gap-1.5 items-start">
            {hasSample && (
              <Badge className="text-[10px] px-2 py-1 leading-none bg-muted text-foreground border-0">
                Sample
              </Badge>
            )}
            {!is_active && (
              <Badge
                variant="destructive"
                className="text-[10px] px-2 py-1 leading-none"
              >
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Product Title */}
          <h1 className="font-normal text-foreground text-sm leading-snug line-clamp-2 break-words mb-2 min-h-[2.5rem]">
            {name}
          </h1>

          {/* Price */}
          <div className="mb-2">
            {typeof dropshipPrice === "number" &&
            Number.isFinite(dropshipPrice) ? (
              <div className="text-base font-semibold text-foreground">
                {formatSinglePrice(dropshipPrice)}
              </div>
            ) : (
              priceAndQuantity &&
              priceAndQuantity?.length > 0 && (
                <div className="text-base font-semibold text-foreground">
                  {formatPriceRange(priceAndQuantity)}
                </div>
              )
            )}
          </div>

          {/* MOQ and Sales Count */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            {priceAndQuantity && priceAndQuantity.length > 0 && (
              <span>MOQ: {priceAndQuantity[0].quantity} pieces</span>
            )}
          </div>

          {/* Verification and Location */}
          {is_verified && (
            <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-border/50">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Verified
              </span>
              {verificationYears && (
                <>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {verificationYears} yrs
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-card h-full overflow-hidden rounded-lg border border-border/50">
      <Skeleton className="aspect-square w-full rounded-t-lg" />
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-auto pt-2 border-t border-border/50">
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
};
