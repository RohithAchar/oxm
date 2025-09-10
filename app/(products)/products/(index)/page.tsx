import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageOpen } from "lucide-react";
import { getProducts } from "@/lib/controller/product/productOperations";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams; // resolve the promise

  const page = parseInt(params.page ?? "1", 10);
  const page_size = parseInt(params.page_size ?? "8", 10);
  const dropshipAvailable = params.dropship_available === "true";
  const sortBy = params.sort ?? "";

  const data = await getProducts({
    page,
    page_size,
    dropship_available: dropshipAvailable,
  });

  // Apply client-side sorting if needed (for fields not supported by API)
  let sortedProducts = [...data.products];

  if (sortBy) {
    sortedProducts = sortProducts(data.products, sortBy);
  }

  const isEmpty = !sortedProducts || sortedProducts.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4">
      {isEmpty ? (
        <div className="flex items-center justify-center py-16 md:py-24">
          <Card className="w-full max-w-xl border-muted-foreground/20">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <PackageOpen className="h-7 w-7 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl">No products found</CardTitle>
              <CardDescription className="text-base">
                Try adjusting your filters or explore the latest picks on the
                home page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button asChild size="sm">
                  <Link href={`/products?page=1&page_size=${page_size}`}>
                    Reset filters
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/">Go to home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid gap-3 md:gap-4 lg:gap-5 xl:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sortedProducts.map((p) => {
              if (!p) return null;
              return (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  imageUrl={p.imageUrl}
                  name={p.name}
                  brand={p.brand || ""}
                  is_verified={p.is_verified || false}
                  city={p.city || ""}
                  is_sample_available={p.is_sample_available || false}
                  tierPricing={
                    p.priceAndQuantity?.map(
                      (tier: {
                        id: string;
                        quantity: number;
                        price: string;
                      }) => ({
                        id: tier.id,
                        quantity: tier.quantity,
                        price: tier.price,
                      })
                    ) || []
                  }
                />
              );
            })}
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
                      }${sortBy ? `&sort=${sortBy}` : ""}`}
                    >
                      {pageNum}
                    </Link>
                  </Button>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

// Client-side sorting function for fields not supported by API
function sortProducts(products: any[], sortBy: string) {
  const sorted = [...products];

  switch (sortBy) {
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "name_desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case "price_asc":
      return sorted.sort((a, b) => {
        const priceA = parseFloat(
          a.price_per_unit?.replace(/[^\d.]/g, "") || "0"
        );
        const priceB = parseFloat(
          b.price_per_unit?.replace(/[^\d.]/g, "") || "0"
        );
        return priceA - priceB;
      });

    case "price_desc":
      return sorted.sort((a, b) => {
        const priceA = parseFloat(
          a.price_per_unit?.replace(/[^\d.]/g, "") || "0"
        );
        const priceB = parseFloat(
          b.price_per_unit?.replace(/[^\d.]/g, "") || "0"
        );
        return priceB - priceA;
      });

    case "verified_desc":
      return sorted.sort((a, b) => {
        if (a.is_verified === b.is_verified) return 0;
        return a.is_verified ? -1 : 1;
      });

    case "created_at_asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

    case "created_at_desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    default:
      return sorted;
  }
}
