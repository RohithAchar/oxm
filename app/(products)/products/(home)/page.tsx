"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Eye,
  Package,
  Star,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const ProductCardSkeleton = () => (
  <Card className="w-full rounded-2xl border-0 shadow-sm bg-card">
    <CardHeader className="p-0">
      <div className="relative w-full aspect-square rounded-t-2xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    </CardHeader>
    <CardContent className="p-4 space-y-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-3 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </CardContent>
  </Card>
);

const ProductCard = ({ product }: { product: Product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const primaryImage =
    product.product_images?.[0]?.image_url || "/placeholder-product.jpg";

  return (
    <Card
      onClick={() => router.push(`/products/${product.id}`)}
      className="group w-full rounded-2xl border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* <CardHeader className="p-0"> */}
      <div className="relative -translate-y-6 w-full aspect-square overflow-hidden rounded-t-2xl">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-xs rounded-full px-2 py-1"
        >
          {product.category?.name || "Uncategorized"}
        </Badge>

        {/* Like button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </Button>
      </div>
      {/* </CardHeader> */}

      <CardContent className="p-4 pt-0 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              by {product.supplier?.full_name || "Unknown Supplier"}
            </span>
            {product.brand && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {product.brand}
                </span>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description || "No description available"}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              ₹{product.sample_price || "N/A"}
            </span>
            <span className="text-xs text-muted-foreground">sample</span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={
                    product.is_sample_available ? "default" : "secondary"
                  }
                  className="text-xs rounded-full"
                >
                  {product.is_sample_available ? "Available" : "Out of Stock"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Sample{" "}
                  {product.is_sample_available ? "available" : "not available"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 rounded-xl h-9 text-sm"
            disabled={!product.is_sample_available}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add Sample
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              router.push(`/products/${product.id}`);
            }}
            variant="outline"
            size="sm"
            className="rounded-xl h-9 px-3"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [loadingMore, setLoadingMore] = useState(false);

  const searchParams = useSearchParams();
  const supabase = createClient();

  // Reset products when filters change
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, [searchParams]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (page > 0) setLoadingMore(true);
        else setLoading(true);

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
          .eq("is_active", true);

        // Apply sorting
        switch (sortBy) {
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          case "oldest":
            query = query.order("created_at", { ascending: true });
            break;
          case "name":
            query = query.order("name", { ascending: true });
            break;
          case "price":
            query = query.order("sample_price", { ascending: true });
            break;
        }

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

        const limit = 12;
        const from = page * limit;
        const to = from + limit - 1;

        const { data, error } = await query.range(from, to);

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

        if (page === 0) {
          setProducts(productsWithImages);
        } else {
          setProducts((prev) => [...prev, ...productsWithImages]);
        }

        if (productsWithImages.length < limit) setHasMore(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [searchParams, page, sortBy]);

  // Loading state
  if (loading && page === 0) {
    return (
      <div className="flex-1 p-4 lg:p-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 p-4 lg:p-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Something went wrong
              </h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="rounded-xl"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2 lg:p-4 bg-background min-h-screen">
      <div className="max-w-full mx-auto px-2 lg:px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Discover and sample products from verified suppliers
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{products.length} products found</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex items-center border rounded-xl p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loadingMore}
                  className="rounded-xl px-8"
                  size="lg"
                >
                  {loadingMore ? "Loading..." : "Load More Products"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
