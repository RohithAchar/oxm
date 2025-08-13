import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/controller/product/productOperations";
import { BadgeCheckIcon, Eye, Locate, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const page_size = parseInt(params.page_size || "8", 10);
  const dropshipAvailable = params.dropship_available === "true";

  const data = await getProducts({
    page,
    page_size,
    dropship_available: dropshipAvailable,
  });

  return (
    <div className="px-4">
      {/* Products Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            imageUrl={p.imageUrl}
            name={p.name}
            brand={p.brand || ""}
            is_verified={p.is_verified || false}
            city={p.city || ""}
            tierPricing={
              p.priceAndQuantity?.map((tier) => ({
                id: tier.id,
                quantity: tier.quantity,
                price: tier.price,
              })) || []
            }
          />
        ))}
      </div>
      {/* Pagination */}
      <div className="flex gap-2 mt-4 justify-center mb-6">
        {data.total_pages > 1 &&
          Array.from({ length: data.total_pages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                asChild
                variant={pageNum === page ? "default" : "outline"}
                key={pageNum}
              >
                <Link
                  href={`/products?page=${pageNum}&page_size=${page_size}${
                    dropshipAvailable ? "&dropship_available=true" : ""
                  }`}
                >
                  {pageNum}
                </Link>
              </Button>
            );
          })}
      </div>
    </div>
  );
}

interface ProductCardProps {
  id: string;
  imageUrl: string;
  name: string;
  brand: string;
  tierPricing?: TierPricingProps[];
  is_verified: boolean;
  city: string;
}

interface TierPricingProps {
  id: string;
  quantity: number;
  price: string;
}

const ProductCard = ({
  id,
  imageUrl,
  name,
  brand,
  tierPricing,
  is_verified,
  city,
}: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`}>
      <div className="relative p-2 bg-card border rounded-xl space-y-4">
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
            className="object-cover object-center rounded-lg"
          />
        </div>
        <div>
          <h1 className="truncate font-semibold text-lg text-foreground">
            {name}
          </h1>
          <p className="truncate text-muted-foreground text-sm mt-1">{brand}</p>
          {city && (
            <p className="flex items-center gap-1 truncate text-muted-foreground text-sm mt-1">
              <MapPin className="w-4 h-4" />
              {city}
            </p>
          )}
        </div>
        <div>
          {tierPricing && tierPricing?.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {tierPricing?.length > 0 && (
                <>
                  <span>Min: {tierPricing[0].quantity} pcs</span>
                  <span>₹{tierPricing[0].price} / pc</span>
                  {tierPricing.length > 1 && (
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
    </Link>
  );
};
