import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/lib/controller/product/productOperations";
import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const page_size = parseInt(params.page_size || "2", 10);
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
}: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`}>
      <div className="p-4 bg-card rounded-xl space-y-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <Image
            fill
            src={imageUrl || "/product-placeholder.png"}
            alt="Product Image"
            className="object-cover object-center rounded-lg"
          />
        </div>
        <div>
          <h1 className="truncate font-semibold text-foreground">{name}</h1>
          <p className="truncate text-primary-foreground text-sm mt-1">
            {brand}
          </p>
        </div>
        <div>
          {tierPricing && tierPricing?.length > 0 && (
            <div>
              {tierPricing?.map(
                (priceNqty: {
                  id: string;
                  quantity: number;
                  price: string;
                }) => (
                  <div
                    key={priceNqty.id}
                    className="flex gap-2 text-sm truncate text-muted-foreground"
                  >
                    <p className="truncate">{priceNqty.quantity} pcs</p>
                    <p className="truncate">Price: ₹{priceNqty.price}/pcs</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
        <Button className="w-full" asChild variant={"default"}>
          <Link href={`/products/${id}`}>
            <Eye className="h-4 w-4" />
            View Product
          </Link>
        </Button>
      </div>
    </Link>
  );
};
