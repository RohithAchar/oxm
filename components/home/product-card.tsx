"use client";

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
  imageUrl: string;
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
    const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
    if (min === max) return `₹${fmt.format(min)}`;
    return `₹${fmt.format(min)} – ₹${fmt.format(max)}`;
  };

  const formatSinglePrice = (value?: number | null) => {
    if (value === undefined || value === null || !Number.isFinite(value)) {
      return null;
    }
    const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
    return `₹${fmt.format(value as number)}`;
  };
  return (
    <Link
      href={`/products/${id}${keepDropship ? "?dropship_available=true" : ""}`}
      className="block h-full"
    >
      <div
        key={id}
        className={`relative isolate bg-white dark:bg-card h-full overflow-hidden cursor-pointer flex flex-col ${
          !is_active ? "opacity-75" : ""
        }`}
      >
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 items-end">
          {!is_active && (
            <Badge
              variant="destructive"
              className="text-[10px] px-2 py-0.5 leading-none"
            >
              Out of Stock
            </Badge>
          )}
          {hasSample && (
            <Badge
              variant="secondary"
              className="text-[10px] px-2 py-0.5 leading-none"
            >
              Sample
            </Badge>
          )}
        </div>
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          {imageLoading && (
            <div className="absolute inset-0 animate-pulse bg-muted/50" />
          )}
          <Image
            fill
            src={imageError ? "/product-placeholder.png" : imgSrc}
            alt="Product Image"
            onError={() => setImageError(true)}
            onLoadingComplete={() => setImageLoading(false)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
            className="object-cover rounded-sm"
          />
        </div>

        {/* Product Details */}
        <div className="p-3 md:p-4 space-y-2 flex-1 flex flex-col">
          {/* Product Title */}
          <h1 className="font-normal text-foreground text-base leading-tight line-clamp-2 break-words">
            {name}
          </h1>

          <div className="flex items-center gap-1 min-h-[1.25rem] min-w-0">
            <p className="text-sm text-muted-foreground truncate flex-1 min-w-0">
              {supplierName}
            </p>
            {is_verified && (
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0.5 leading-none flex-shrink-0 bg-blue-50 text-blue-700 border-blue-200"
              >
                <BadgeCheckIcon className="h-2 w-2 mr-0.5" />
                Verified
              </Badge>
            )}
          </div>

          {/* Badges moved to top-right for unified placement */}

          {/* Price section */}
          {typeof dropshipPrice === "number" &&
          Number.isFinite(dropshipPrice) ? (
            <div className="space-y-1.5 mt-auto">
              <div className="text-base font-bold text-foreground">
                {formatSinglePrice(dropshipPrice)}
              </div>
              <div className="text-sm text-muted-foreground">
                Dropship price
              </div>
            </div>
          ) : (
            priceAndQuantity &&
            priceAndQuantity?.length > 0 && (
              <div className="space-y-1.5 mt-auto">
                <div className="text-base font-bold text-foreground">
                  {formatPriceRange(priceAndQuantity)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Min. order: {priceAndQuantity[0].quantity} pieces
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-card h-fit overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-sm" />
      <div className="px-3 py-2 space-y-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};
