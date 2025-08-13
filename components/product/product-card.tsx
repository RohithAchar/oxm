import Link from "next/link";
import { Badge } from "../ui/badge";
import { BadgeCheckIcon, Eye, MapPin, Package } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

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
  return (
    <Link href={`/products/${id}`}>
      <div className="relative p-2 bg-card border rounded-xl space-y-4 hover:shadow-md transition-shadow">
        {/* Top badges - stacked vertically when both present */}
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-1">
          {is_sample_available && (
            <Badge
              variant="secondary"
              className="bg-green-500 text-white dark:bg-green-600"
            >
              <Package className="w-3 h-3 mr-1" />
              Sample
            </Badge>
          )}
        </div>

        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            fill
            src={imageUrl || "/product-placeholder.png"}
            alt="Product Image"
            className="object-cover object-center rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <h1 className="truncate font-semibold text-sm text-foreground">
            {name}
          </h1>
          <div className="flex items-center justify-between">
            <p className="truncate text-muted-foreground text-xs">{brand}</p>
            {is_verified && (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                Verified ✓
              </span>
            )}
          </div>
          {city && (
            <p className="flex items-center gap-1 truncate text-muted-foreground text-xs">
              <MapPin className="w-3 h-3" />
              {city}
            </p>
          )}
        </div>

        {/* Improved Pricing Section */}
        {tierPricing && tierPricing.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium">
                  MIN ORDER
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {tierPricing[0].quantity} pcs
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs text-muted-foreground font-medium">
                  PRICE
                </span>
                <span className="text-sm font-bold text-primary">
                  ₹{tierPricing[0].price}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    /pc
                  </span>
                </span>
              </div>
            </div>

            {tierPricing.length > 1 && (
              <div className="flex items-center justify-center pt-1">
                <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                  +{tierPricing.length - 1} more tier
                  {tierPricing.length > 2 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        )}

        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/products/${id}`}>
            <Eye className="h-4 w-4 text-primary mr-2" />
            View Product
          </Link>
        </Button>
      </div>
    </Link>
  );
};
