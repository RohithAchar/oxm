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

  return (
    <Link href={`/products/${id}`}>
      <div className="relative bg-white dark:bg-card h-fit overflow-hidden">
        {/* Badges */}
        <div className="absolute top-1 right-1 z-20 flex flex-col gap-0.5">
          {is_verified && (
            <Badge
              variant="secondary"
              className="bg-blue-500 text-white dark:bg-blue-600 text-xs px-1.5 py-0.5"
            >
              <BadgeCheckIcon className="h-2.5 w-2.5 mr-0.5" />
              Verified
            </Badge>
          )}
          {is_sample_available && (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600 text-xs px-1.5 py-0.5"
            >
              Sample
            </Badge>
          )}
        </div>

        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            fill
            src={imageError ? "/product-placeholder.png" : (imageUrl || "/product-placeholder.png")}
            alt="Product Image"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover rounded-sm"
          />
        </div>

        {/* Product Details */}
        <div className="px-3 py-2 space-y-1.5">
          {/* Product Title */}
          <h1 className="font-medium text-foreground text-sm leading-tight line-clamp-2">
            {name}
          </h1>
          
          {/* Brand */}
          <p className="text-sm text-muted-foreground truncate">
            {brand}
          </p>

          {/* City */}
          {city && (
            <p className="flex items-center gap-1 text-sm text-muted-foreground truncate">
              <MapPin className="w-3 h-3" />
              {city}
            </p>
          )}

          {/* Price and MOQ */}
          {tierPricing && tierPricing.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                ₹{tierPricing[0].price}
                {tierPricing.length > 1 && (
                  <span className="text-sm text-muted-foreground ml-1">
                    -{tierPricing[tierPricing.length - 1].price}
                  </span>
                )}
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
