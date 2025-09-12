"use client";

import { useFavorites } from "@/lib/contexts/favorites-context";
import { getProductByIdCached } from "@/lib/controller/product/productOperations";
import { ProductCard } from "@/components/home/product-card";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  brand?: string;
  supplierName: string;
  imageUrl: string;
  priceAndQuantity: any;
  is_verified: boolean;
  is_sample_available: boolean;
}

export default function FavoritesSection() {
  const { favorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      try {
        const products = await Promise.all(
          favorites.map(async (productId) => {
            try {
              const product = await getProductByIdCached(productId);
              if (product) {
                return {
                  id: product.id,
                  name: product.name,
                  brand: product.brand,
                  supplierName: product.brand || "Supplier", // Use brand as fallback since supplier_name doesn't exist
                  imageUrl: product.product_images?.[0]?.image_url || "/product-placeholder.png",
                  priceAndQuantity: product.product_tier_pricing || [],
                  is_verified: false, // Default to false since is_verified doesn't exist on product
                  is_sample_available: product.is_sample_available,
                };
              }
              return null;
            } catch (error) {
              console.error(`Error loading product ${productId}:`, error);
              return null;
            }
          })
        );

        setFavoriteProducts(products.filter(Boolean) as Product[]);
      } catch (error) {
        console.error("Error loading favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProducts();
  }, [favorites]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="w-full text-left">
            <h2 className="text-foreground text-xl md:text-2xl font-semibold mb-1">
              Your Favorites
            </h2>
            <p className="text-sm text-muted-foreground">
              Loading your saved products...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-lg mb-2"></div>
              <div className="h-4 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="w-full text-left">
            <h2 className="text-foreground text-xl md:text-2xl font-semibold mb-1">
              Your Favorites
            </h2>
            <p className="text-sm text-muted-foreground">
              Products you've saved
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No favorites yet</h3>
          <p className="text-sm text-muted-foreground">
            Start exploring products and tap the heart icon to add them to your favorites.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="w-full text-left">
            <h2 className="text-foreground text-xl md:text-2xl font-semibold mb-1">
              Your Favorites
            </h2>
            <p className="text-sm text-muted-foreground">
              Products you've saved ({favoriteProducts.length})
            </p>
          </div>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand || ""}
              supplierName={product.supplierName}
              imageUrl={product.imageUrl}
              priceAndQuantity={product.priceAndQuantity}
              is_verified={product.is_verified}
              hasSample={product.is_sample_available}
            />
        ))}
      </div>
    </section>
  );
}
