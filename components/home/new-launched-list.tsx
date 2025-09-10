import { getLatestProducts } from "@/lib/controller/product/productOperations";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { Button } from "../ui/button";

export const NewLaunchedItems = async () => {
  let products: Awaited<ReturnType<typeof getLatestProducts>>;
  try {
    products = await getLatestProducts();
  } catch (error) {
    console.error("Error fetching latest products:", error);
    products = []; // Fallback to empty array
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto mt-12">
      <div>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="w-full text-center">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Latest Launches
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground">
              Unveiling fresh finds, inspired designs, and unique creations to
              spark curiosity and style.
            </p>
            <Button variant="link">View all</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {products.map((products) => (
            <ProductCard
              key={products.id}
              id={products.id}
              name={products.name}
              brand={products.brand || ""}
              supplierName={products.brand || "Supplier"}
              imageUrl={products.imageUrl || "/product-placeholder.png"}
              priceAndQuantity={products.priceAndQuantity}
              is_verified={products.is_verified || false}
              hasSample={products.is_sample_available || false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const NewLaunchedItemsSkeleton = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-12">
      <div>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="w-full text-center">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Latest Launches
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground">
              Unveiling fresh finds, inspired designs, and unique creations to
              spark curiosity and style.
            </p>
            <Button variant="link">View all</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
        </div>
      </div>
    </section>
  );
};
