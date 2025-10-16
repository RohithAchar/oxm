import Image from "next/image";
import Link from "next/link";
import { BadgeCheckIcon } from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/database.types";

import { Badge } from "@/components/ui/badge";
import {
  getProductMainImageUrl,
  getPricesAndQuantities,
} from "@/lib/controller/product/productOperations";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 21600; // 6 hours

type TierPricingType =
  Database["public"]["Tables"]["product_tier_pricing"]["Row"];

type JustForYouProductCardProps = {
  id: string;
  imageUrl: string | null;
  description: string | null;
  isSampleAvailable: boolean;
  name: string;
  supplierName: string;
  tierPricing: Pick<TierPricingType, "id" | "price" | "quantity">[] | null;
  isSupplierVerified: boolean;
};

export const JustForYouProductList = async () => {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id,name,description,is_sample_available,supplier_id")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("JustForYou: error fetching products", error);
  }

  const enriched = await Promise.all(
    (products || []).map(async (product) => {
      const [imageUrl, tierPricing, business] = await Promise.all([
        getProductMainImageUrl(product.id),
        getPricesAndQuantities(product.id),
        product.supplier_id
          ? getBusiness(product.supplier_id)
          : Promise.resolve(undefined as any),
      ]);

      return {
        id: product.id,
        imageUrl: imageUrl || null,
        description: product.description,
        isSampleAvailable: Boolean(product.is_sample_available),
        name: product.name || "",
        supplierName: business?.business_name || "",
        tierPricing:
          (tierPricing || [])?.map((t: any) => ({
            id: t.id,
            price: t.price,
            quantity: t.quantity,
          })) || [],
        isSupplierVerified: Boolean(business?.is_verified),
        businessStatus: business?.status,
      } as const;
    })
  );

  const visible = enriched.filter((p) => p.businessStatus === "APPROVED");

  return (
    <div className="grid grid-cols-2 gap-2">
      {visible.map((p) => (
        <JustForYouProductCard
          key={p.id}
          id={p.id}
          imageUrl={p.imageUrl}
          description={p.description}
          isSampleAvailable={p.isSampleAvailable}
          name={p.name}
          supplierName={p.supplierName}
          tierPricing={p.tierPricing}
          isSupplierVerified={p.isSupplierVerified}
        />
      ))}
    </div>
  );
};

export const JustForYouProductCard = ({
  id,
  imageUrl,
  description,
  isSampleAvailable,
  name,
  supplierName,
  tierPricing,
  isSupplierVerified,
}: JustForYouProductCardProps) => {
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
          src={imageUrl || "/product-placeholder.png"}
          alt={description || name}
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

export const JustForYouProductListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 4 }).map((_, idx) => (
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
  );
};
