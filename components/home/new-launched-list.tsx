import { getLatestProducts } from "@/lib/controller/product/productOperations";
import { ProductCard } from "./product-card";

const NewLaunchedItems = async () => {
  const products = await getLatestProducts();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section
      className={`px-4 sm:px-6 md:px-12 py-8 md:py-20 transition-all duration-1000 delay-700`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Latest Launches
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Discover what's new and exciting
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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
