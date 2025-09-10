"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { BadgeCheckIcon, Eye } from "lucide-react";
import { Badge } from "../ui/badge";

import { useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  supplierName: string;
  imageUrl: string;
  priceAndQuantity: any[];
  is_verified: boolean;
  verificationYears?: number;
  hasSample?: boolean;
}

export const ProductCard = ({
  id,
  name,
  brand,
  supplierName,
  imageUrl,
  priceAndQuantity,
  is_verified,
  verificationYears,
  hasSample,
}: ProductCardProps) => {
  const [imgSrc, setImgSrc] = useState<string>(imageUrl || "/product-placeholder.png");
  const [imageError, setImageError] = useState(false);
  return (
    <Link href={`/products/${id}`}>
      <div
        key={id}
        className="relative bg-white dark:bg-card h-fit overflow-hidden cursor-pointer"
      >
      {/* Badges */}
      <div className="absolute top-1 right-1 z-20 flex flex-col gap-0.5">
        {is_verified && (
          <Badge
            variant="secondary"
            className="bg-blue-500 text-white dark:bg-blue-600 text-xs px-1.5 py-0.5"
          >
            <BadgeCheckIcon className="h-2.5 w-2.5 mr-0.5" />
            Verified {verificationYears && `${verificationYears} yrs`}
          </Badge>
        )}
        {hasSample && (
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
          src={imageError ? "/product-placeholder.png" : imgSrc}
          alt="Product Image"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
          className="object-cover rounded-sm transition duration-300 hover:brightness-100 brightness-100 dark:brightness-75"
        />
      </div>

      {/* Product Details */}
      <div className="px-3 py-2 space-y-1.5">
        {/* Product Title */}
        <h1 className="font-medium text-foreground text-sm leading-tight line-clamp-2">
          {name}
        </h1>
        
        {/* Supplier Name */}
        <p className="text-sm text-muted-foreground truncate">
          {supplierName}
        </p>

        {/* Price and MOQ */}
        {priceAndQuantity && priceAndQuantity?.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-foreground">
              ₹{priceAndQuantity[0].price}
              {priceAndQuantity.length > 1 && (
                <span className="text-sm text-muted-foreground ml-1">
                  -{priceAndQuantity[priceAndQuantity.length - 1].price}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Min. order: {priceAndQuantity[0].quantity} pieces
            </div>
          </div>
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
