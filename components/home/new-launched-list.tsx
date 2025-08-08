import { getLatestProducts } from "@/lib/controller/product/productOperations";
import { ProductCard } from "./product-card";
import { ArrowRight } from "lucide-react";

const NewLaunchedItems = async () => {
  const products = await getLatestProducts();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div>
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground mb-2">
              Latest Launches
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              Unveiling fresh finds, inspired designs, and unique creations to
              spark curiosity and style.
            </p>
          </div>
          <button className="flex cursor-pointer items-center text-primary font-medium transition-colors duration-200">
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden text-sm">All</span>
            <ArrowRight size={16} className="ml-1 sm:ml-2 sm:w-4 sm:h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {products.map((products) => (
            <ProductCard
              key={products.id}
              id={products.id}
              name={products.name}
              brand={products.brand || ""}
              imageUrl={products.imageUrl || "/product-placeholder.png"}
              priceAndQuantity={products.priceAndQuantity}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewLaunchedItems;
