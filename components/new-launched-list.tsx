// components/new-launched-items.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/database.types";
import {
  Star,
  Package,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Calendar,
} from "lucide-react";

type Product = Tables<"products">;
type ProductImage = Tables<"product_images">;
type Category = Tables<"categories">;
type Profile = Tables<"profiles">;
type ProductTierPricing = Tables<"product_tier_pricing">;

interface ProductWithRelations extends Product {
  product_images: ProductImage[];
  category: Category | null;
  supplier: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  product_tier_pricing: ProductTierPricing[];
}

interface NewLaunchedItemsProps {
  limit?: number;
  className?: string;
  showHeader?: boolean;
  variant?: "grid" | "carousel";
  daysThreshold?: number; // Consider items "new" if created within this many days
}

export default function NewLaunchedItems({
  limit = 6,
  className = "",
  showHeader = true,
  variant = "grid",
  daysThreshold = 30,
}: NewLaunchedItemsProps) {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNewProducts() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        // Calculate the date threshold for "new" products
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

        const { data, error } = await supabase
          .from("products")
          .select(
            `
            *,
            product_images (
              id,
              image_url,
              display_order
            ),
            category:categories!products_category_id_fkey (
              id,
              name,
              slug
            ),
            supplier:profiles!products_supplier_id_fkey (
              id,
              full_name,
              avatar_url
            ),
            product_tier_pricing (
              id,
              quantity,
              price,
              is_active
            )
          `
          )
          .eq("is_active", true)
          .gte("created_at", thresholdDate.toISOString())
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) {
          throw error;
        }

        setProducts((data as ProductWithRelations[]) || []);
      } catch (err) {
        console.error("Error fetching new products:", err);
        setError("Failed to load new products");
      } finally {
        setLoading(false);
      }
    }

    fetchNewProducts();
  }, [limit, daysThreshold]);

  const formatPrice = (tierPricing: ProductTierPricing[]) => {
    const activePricing = tierPricing?.filter(
      (tier) => tier.is_active !== false
    );
    if (!activePricing?.length) return null;

    const minPrice = Math.min(...activePricing.map((tier) => tier.price));
    return `₹${minPrice.toLocaleString()}`;
  };

  const getProductImage = (product: ProductWithRelations) => {
    const sortedImages = product.product_images?.sort(
      (a, b) => (a.display_order || 0) - (b.display_order || 0)
    );
    return sortedImages?.[0]?.image_url || "/placeholder-product.jpg";
  };

  const getDaysOld = (createdAt: string | null) => {
    if (!createdAt) return 999; // Return a high number for null dates
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold">New Launches</h2>
            </div>
          </div>
        )}
        <div
          className={`grid ${
            variant === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
          } gap-4`}
        >
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">New Launches</h2>
          </div>
        )}
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">New Launches</h2>
          </div>
        )}
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No new products launched recently</p>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold">New Launches</h2>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              {products.length} items
            </Badge>
          </div>
          <Link href="/products?filter=new">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      )}

      <div
        className={`grid gap-4 ${
          variant === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        }`}
      >
        {products.map((product) => {
          const daysOld = getDaysOld(product.created_at);
          const price = formatPrice(product.product_tier_pricing);
          const productImage = getProductImage(product);

          return (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100">
                <CardContent className="p-3 flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={productImage}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />

                    {/* New Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        NEW
                      </Badge>
                    </div>

                    {/* Days old indicator */}
                    {daysOld <= 7 && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-green-50 text-green-700 text-xs"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {daysOld}d
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2 mt-auto">
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    {product.brand && (
                      <p className="text-xs text-gray-500">{product.brand}</p>
                    )}

                    {product.category && (
                      <p className="text-xs text-blue-600 font-medium">
                        {product.category.name}
                      </p>
                    )}

                    {/* Price */}
                    {price && (
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          {price}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          4.0
                        </div>
                      </div>
                    )}

                    {/* Supplier */}
                    {product.supplier && (
                      <p className="text-xs text-gray-500 truncate">
                        by {product.supplier.full_name || "Supplier"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Load More Button for larger lists */}
      {products.length === limit && (
        <div className="text-center mt-8">
          <Link href="/products?filter=new">
            <Button variant="outline" size="lg">
              <Package className="h-4 w-4 mr-2" />
              View All New Products
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
