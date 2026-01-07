import {
  getProductMainImageUrl,
  getPricesAndQuantities,
} from "@/lib/controller/product/productOperations";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import { createAnonClient } from "@/utils/supabase/server";
import { InfiniteProductsGrid } from "./infinite-products-grid";
import { ProductCardSkeleton } from "./product-card";

export const FeaturedProducts = async () => {
  // Fetch initial products for SSR
  let initialProducts: any[] = [];
  try {
    const supabase = await createAnonClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,brand,is_sample_available,supplier_id,is_active,dropship_price,dropship_available"
      )
      .order("created_at", { ascending: false })
      .limit(12);

    if (!error && data) {
      // Enrich products with metadata
      const enriched = await Promise.all(
        data.map(async (product) => {
          const [imageUrl, priceAndQuantity, business] = await Promise.all([
            getProductMainImageUrl(product.id).catch(() => null),
            getPricesAndQuantities(product.id).catch(() => []),
            product.supplier_id
              ? getBusiness(product.supplier_id).catch(() => null)
              : Promise.resolve(null),
          ]);

          // Only show products from approved businesses
          if (business?.status !== "APPROVED") {
            return null;
          }

          return {
            id: product.id,
            name: product.name || "",
            brand: product.brand || "",
            supplierName: business?.business_name || "Supplier",
            imageUrl: imageUrl || null,
            priceAndQuantity: (priceAndQuantity || []).map((tier: any) => ({
              id: tier.id,
              price:
                typeof tier.price === "number"
                  ? tier.price / 100
                  : parseFloat(tier.price) / 100,
              quantity: tier.quantity,
            })),
            dropshipPrice: product.dropship_price
              ? product.dropship_price / 100
              : undefined,
            is_verified: business?.is_verified || false,
            hasSample: Boolean(product.is_sample_available),
            is_active: product.is_active,
          };
        })
      );

      initialProducts = enriched.filter((p) => p !== null);
    }
  } catch (error) {
    console.error("Error fetching initial products:", error);
  }

  return (
    <div className="bg-muted">
      <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          {/* <div className="w-full text-center">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-foreground mb-2">
            Featured Products
          </h2>
          <p className="text-center text-sm sm:text-base text-muted-foreground">
            Discover quality products from verified suppliers
          </p>
        </div> */}
        </div>
        <InfiniteProductsGrid
          apiEndpoint="/api/home-products"
          gridClassName="grid items-stretch auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2"
          pageSize={12}
          initialItems={initialProducts}
        />
      </section>
    </div>
  );
};

export const FeaturedProductsSkeleton = () => {
  return (
    <div className="bg-muted">
      <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          {/* <div className="w-full text-center">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-foreground mb-2">
              Featured Products
            </h2>
            <p className="text-center text-sm sm:text-base text-muted-foreground">
              Discover quality products from verified suppliers
            </p>
          </div> */}
        </div>
        <div className="grid items-stretch auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {Array(12)
            .fill(null)
            .map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
        </div>
      </section>
    </div>
  );
};
