import {
  getProductByIdCached,
  getLatestProducts,
} from "@/lib/controller/product/productOperations";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import ProductViewV2Client from "@/components/product/product-view-v2.client";
import { ProductCard } from "@/components/home/product-card";

export default async function ProductViewV2({ id }: { id: string }) {
  const product = await getProductByIdCached(id);
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-medium text-gray-900">
            Product not found
          </h2>
          <p className="text-gray-500">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const business = await getBusiness(product.supplier_id!);

  const latest = await getLatestProducts();
  const similar = latest.filter((p) => p.id !== product.id).slice(0, 12);

  return (
    <div className="flex flex-col">
      <ProductViewV2Client product={product} business={business} />

      {similar.length > 0 && (
        <section className="px-4 lg:px-0 pb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="w-full text-left">
              <h2 className="text-foreground text-xl md:text-2xl font-semibold mb-1">
                Similar products
              </h2>
              <p className="text-sm text-muted-foreground">
                You might also like
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
            {similar.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                brand={p.brand || ""}
                supplierName={p.supplier_name || p.brand || "Supplier"}
                imageUrl={p.imageUrl as string}
                priceAndQuantity={p.priceAndQuantity}
                is_verified={p.is_verified}
                hasSample={p.is_sample_available}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
