import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/controller/product/productOperations";
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
      <div className="grid gap-2 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.products.map((p) => (
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
