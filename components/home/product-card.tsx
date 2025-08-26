"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { BadgeCheckIcon, Eye } from "lucide-react";
import { Badge } from "../ui/badge";

import { useTheme } from "next-themes";
import { Skeleton } from "../ui/skeleton";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  priceAndQuantity: any[];
  is_verified: boolean;
}

export const ProductCard = ({
  id,
  name,
  brand,
  imageUrl,
  priceAndQuantity,
  is_verified,
}: ProductCardProps) => {
  const { theme } = useTheme();
  return (
    <div
      key={id}
      className="relative p-2 border rounded-xl bg-card space-y-4 h-fit"
    >
      {is_verified && (
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600 absolute right-3 top-3 z-20"
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
      )}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        <Image
          fill
          src={imageUrl || "/product-placeholder.png"}
          alt="Product Image"
          className={`
      object-cover rounded-lg
      transition duration-300
      hover:brightness-100
      ${theme === "dark" ? "brightness-75" : "brightness-100"}
      `}
        />
      </div>
      <div className="space-y-2">
        <div>
          <h1 className="truncate font-semibold text-foreground">{name}</h1>
          <p className="text-xs text-muted-foreground">{brand}</p>
        </div>
        {priceAndQuantity && priceAndQuantity?.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {priceAndQuantity?.length > 0 && (
              <>
                <span className="truncate">
                  Min: {priceAndQuantity[0].quantity} pcs
                </span>
                <span className="truncate">
                  ₹{priceAndQuantity[0].price} / pc
                </span>
                {priceAndQuantity.length > 1 && (
                  <span className="text-xs">...</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <Button variant={"secondary"} className="w-full" asChild>
        <Link href={`/products/${id}`}>
          <Eye className="h-4 w-4 text-primary" />
          View Product
        </Link>
      </Button>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="rounded-xl space-y-4 h-fit">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
};
