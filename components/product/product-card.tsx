"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { BadgeCheckIcon, Eye, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  imageUrl: string;
  name: string;
  brand: string;
  tierPricing?: TierPricingProps[];
  is_verified: boolean;
  city: string;
  is_sample_available: boolean;
}

interface TierPricingProps {
  id: string;
  quantity: number;
  price: string;
}

export const ProductCard = ({
  id,
  imageUrl,
  name,
  brand,
  tierPricing,
  is_verified,
  city,
  is_sample_available,
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const isDemoBrand = /demo/i.test(brand || "");

  const formatPriceRange = (tiers?: TierPricingProps[]) => {
    if (!tiers || tiers.length === 0) return null;
    const prices = tiers
      .map((t) => (typeof t.price === "number" ? t.price : parseFloat(t.price)))
      .filter((n) => Number.isFinite(n)) as number[];
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
    if (min === max) return `₹${fmt.format(min)}`;
    return `₹${fmt.format(min)} – ₹${fmt.format(max)}`;
  };

  return (
    <Link href={`/products/${id}`} className="block h-full">
      <div className="relative isolate bg-white dark:bg-card h-full overflow-hidden flex flex-col">
        {/* No floating badges; inline below title for consistency */}

        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            fill
            src={
              imageError
                ? "/product-placeholder.png"
                : imageUrl || "/product-placeholder.png"
            }
            alt="Product Image"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
            className="object-cover rounded-sm"
          />
        </div>

        {/* Product Details */}
        <div className="p-3 md:p-4 space-y-2 flex-1 flex flex-col">
          {/* Product Title */}
          <h1 className="font-semibold text-foreground text-base leading-tight line-clamp-2 break-words">
            {name}
          </h1>

          {/* Unified badge row */}
          {(is_verified || is_sample_available) && (
            <div className="flex items-center gap-2">
              {is_verified && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0.5 leading-none"
                >
                  <BadgeCheckIcon className="h-2.5 w-2.5 mr-1" />
                  Verified
                </Badge>
              )}
              {is_sample_available && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0.5 leading-none"
                >
                  Sample
                </Badge>
              )}
            </div>
          )}

          {/* Brand (hide obvious demo values) */}
          {!isDemoBrand && (
            <p className="text-sm text-muted-foreground truncate">{brand}</p>
          )}

          {/* City */}
          {city && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground truncate">
              <MapPin className="w-3 h-3" />
              {city}
            </p>
          )}

          {/* Price and MOQ */}
          {tierPricing && tierPricing.length > 0 && (
            <div className="space-y-1 mt-auto">
              <div className="text-base font-bold text-foreground">
                {formatPriceRange(tierPricing)}
              </div>
              <div className="text-sm text-muted-foreground">
                Min. order: {tierPricing[0].quantity} pieces
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
