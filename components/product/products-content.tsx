import { ProductCard } from "@/components/home/product-card";
import { AdvancedSearch } from "@/components/product/advanced-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageOpen } from "lucide-react";
import Link from "next/link";
import {
  getEnhancedProducts,
  EnhancedProductFilters,
} from "@/lib/controller/product/enhancedProductOperations";

export default async function ProductsContent({
  params,
}: {
  params: Record<string, string | undefined>;
}) {
  const filters: EnhancedProductFilters = {
    q: params.q,
    category: params.category,
    subcategory: params.subcategory,
    priceMin: params.price_min ? parseFloat(params.price_min) : undefined,
    priceMax: params.price_max ? parseFloat(params.price_max) : undefined,
    city: params.city,
    state: params.state,
    sampleAvailable: params.sample_available === "true" ? true : undefined,
    dropshipAvailable: params.dropship_available === "true" ? true : undefined,
    tags: params.tags ? params.tags.split(",").filter(Boolean) : undefined,
    colors: params.colors
      ? params.colors.split(",").filter(Boolean)
      : undefined,
    sizes: params.sizes ? params.sizes.split(",").filter(Boolean) : undefined,
    sortBy: params.sort || "created_at_desc",
    page: parseInt(params.page ?? "1", 10),
    pageSize: parseInt(params.page_size ?? "12", 10),
  };

  const data = await getEnhancedProducts(filters);
  const isEmpty = !data.products || data.products.length === 0;

  return (
    <div className="space-y-6">
      {/* Summary Bar (Active Filters removed) */}
      <div className="bg-background border-b">
        <div className="space-y-4 py-4">
          {/* Results Summary */}
          <div className="text-sm text-muted-foreground text-left">
            {data.products.length === data.total
              ? `Showing all ${data.total} products`
              : `${data.total} products found`}
            {data.totalPages > 1 &&
              ` (Page ${data.page} of ${data.totalPages})`}
          </div>
        </div>
      </div>

      {/* Filters Button - left-aligned anchor above products */}
      <div>
        <AdvancedSearch filterOptions={data.filters} />
      </div>

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
                  <Link href="/products">Reset filters</Link>
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
          <div className="grid items-stretch auto-rows-fr gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {data.products
              .filter((p) => p && !/footer/i.test((p.name || "").toString()))
              .map((p) => {
                if (!p) return null;
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    imageUrl={p.imageUrl}
                    name={p.name}
                    brand={p.brand || ""}
                    supplierName={p.supplierName}
                    priceAndQuantity={p.priceAndQuantity || []}
                    dropshipPrice={
                      filters.dropshipAvailable
                        ? p.dropship_price
                          ? (typeof p.dropship_price === "string"
                              ? parseFloat(p.dropship_price)
                              : Number(p.dropship_price)) / 100
                          : undefined
                        : undefined
                    }
                    is_verified={p.is_verified || false}
                    hasSample={p.is_sample_available || false}
                    is_active={p.is_active}
                  />
                );
              })}
          </div>

          {/* Pagination */}
          <div className="flex gap-2 mt-8 justify-center">
            {data.totalPages > 1 &&
              Array.from({ length: data.totalPages }, (_, i) => {
                const pageNum = i + 1;
                const paginationParams = new URLSearchParams();

                // Preserve all current filters in pagination
                Object.entries(filters).forEach(([key, value]) => {
                  if (value !== undefined && value !== "" && value !== false) {
                    if (Array.isArray(value) && value.length > 0) {
                      paginationParams.set(key, value.join(","));
                    } else if (!Array.isArray(value)) {
                      paginationParams.set(key, String(value));
                    }
                  }
                });

                paginationParams.set("page", String(pageNum));

                return (
                  <Button
                    asChild
                    variant={pageNum === data.page ? "default" : "outline"}
                    key={pageNum}
                  >
                    <Link href={`/products?${paginationParams.toString()}`}>
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
