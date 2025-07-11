"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Eye, Package, Star, Heart } from "lucide-react";
import type { Tables } from "@/utils/supabase/database.types";
import Image from "next/image";

type Product = Tables<"products"> & {
  category: Pick<Tables<"categories">, "id" | "name" | "slug"> | null;
  subcategory: Pick<Tables<"categories">, "id" | "name" | "slug"> | null;
  supplier: Pick<Tables<"profiles">, "id" | "full_name"> | null;
  product_images: Pick<
    Tables<"product_images">,
    "id" | "image_url" | "display_order"
  >[];
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("products")
          .select(
            `
            *,
            category:categories!products_category_id_fkey(id, name, slug),
            subcategory:categories!products_subcategory_id_fkey(id, name, slug),
            supplier:profiles!products_supplier_id_fkey(id, full_name)
          `
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        // Apply category filters
        const categoryFilters = searchParams.get("categories");
        if (categoryFilters) {
          const categoryIds = categoryFilters.split(",");
          query = query.in("category_id", categoryIds);
        }

        // Apply subcategory filters
        const subcategoryFilters = searchParams.get("subcategories");
        if (subcategoryFilters) {
          const subcategoryIds = subcategoryFilters.split(",");
          query = query.in("subcategory_id", subcategoryIds);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching products:", error);
          setError("Failed to fetch products. Please try again.");
          return;
        }

        // Fetch product images separately for each product
        const productsWithImages = await Promise.all(
          data.map(async (product) => {
            const { data: images, error: imagesError } = await supabase
              .from("product_images")
              .select("id, image_url, display_order")
              .eq("product_id", product.id)
              .order("display_order", { ascending: true });

            if (imagesError) {
              console.error("Error fetching product images:", imagesError);
              return { ...product, product_images: [] };
            }

            return { ...product, product_images: images || [] };
          })
        );

        setProducts(productsWithImages);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto p-4">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <Skeleton className="w-full aspect-square rounded mb-4" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4">
      <h1 className="text-xl font-semibold">View Products</h1>
      <p className="text-xs font-light text-muted-foreground">
        Some support text here
      </p>

      <div className="flex gap-6 mt-8 flex-wrap">
        {products.map((product) => (
          <Card className="w-[300px] rounded-2xl shadow-sm">
            <CardHeader className="p-0 overflow-hidden">
              <div className="relative w-full h-[200px]">
                <Image
                  src={product.product_images[0].image_url}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-2xl"
                />
                <Badge className="absolute top-2 right-2">
                  {product.category?.name}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              <CardTitle className="text-lg">{product.name}</CardTitle>

              <div className="flex items-center space-x-1 text-yellow-500 text-sm">
                <span className="text-muted-foreground text-xs ml-1">
                  {product.brand}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <p className="font-semibold text-lg">{product.sample_price}</p>
                {product.is_sample_available ? (
                  <Badge variant="outline">Available</Badge>
                ) : (
                  <Badge variant="destructive">Not Available</Badge>
                )}
              </div>

              <Button className="w-full">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>

              <Button variant={"outline"} className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
