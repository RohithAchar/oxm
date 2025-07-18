"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Eye,
  Package,
  Star,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
  Layers,
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
  product_tier_pricing: Pick<
    Tables<"product_tier_pricing">,
    "id" | "price" | "quantity" | "is_active"
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

  // Get active tier pricing sorted by quantity
  const activeTierPricing =
    product.product_tier_pricing
      ?.filter((tier) => tier.is_active)
      .sort((a, b) => a.quantity - b.quantity) || [];

  // Get the lowest price (usually the highest quantity tier)
  const lowestPrice =
    activeTierPricing.length > 0
      ? Math.min(...activeTierPricing.map((tier) => tier.price))
      : null;

  // Get the starting price (lowest quantity tier)
  const startingPrice =
    activeTierPricing.length > 0 ? activeTierPricing[0].price : null;

  // Get minimum order quantity
  const minOrderQty =
    activeTierPricing.length > 0 ? activeTierPricing[0].quantity : null;

  return (
    <Card
      onClick={() => router.push(`/products/${product.id}`)}
      className="group w-full rounded-2xl border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl">
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

        {/* Tier pricing indicator */}
        {activeTierPricing.length > 1 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="default"
                  className="absolute top-3 right-12 bg-primary/90 backdrop-blur-sm text-xs rounded-full px-2 py-1"
                >
                  <Layers className="w-3 h-3 mr-1" />
                  {activeTierPricing.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{activeTierPricing.length} pricing tiers available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Like button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
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
          <div className="flex flex-col gap-1">
            {startingPrice && (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  ₹{startingPrice}
                </span>
                {lowestPrice && lowestPrice !== startingPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{lowestPrice}
                  </span>
                )}
              </div>
            )}
            {minOrderQty && (
              <span className="text-xs text-muted-foreground">
                Min: {minOrderQty}{" "}
                {product.product_tier_pricing[0].quantity || "pcs"}
              </span>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={
                    activeTierPricing.length > 0 ? "default" : "secondary"
                  }
                  className="text-xs rounded-full"
                >
                  {activeTierPricing.length > 0 ? "Available" : "Out of Stock"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Product{" "}
                  {activeTierPricing.length > 0 ? "available" : "not available"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Tier pricing preview */}
        {activeTierPricing.length > 1 && (
          <div className="bg-muted/50 rounded-lg p-2 space-y-1">
            <div className="text-xs font-medium text-muted-foreground">
              Bulk Pricing:
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>{activeTierPricing[0].quantity}+ units</span>
              <span className="font-medium">₹{activeTierPricing[0].price}</span>
            </div>
            {activeTierPricing.length > 1 && (
              <div className="flex items-center justify-between text-xs">
                <span>
                  {activeTierPricing[activeTierPricing.length - 1].quantity}+
                  units
                </span>
                <span className="font-medium text-primary">
                  ₹{activeTierPricing[activeTierPricing.length - 1].price}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 rounded-xl h-9 text-sm"
            disabled={activeTierPricing.length === 0}
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
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
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 10000]);

  const searchParams = useSearchParams();
  const supabase = createClient();

  // Reset products when filters change
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, [searchParams, appliedPriceRange, sortBy]);

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
            supplier:profiles!products_supplier_id_fkey(id, full_name),
            product_tier_pricing(id, price, quantity, is_active)
          `
          )
          .eq("is_active", true);

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

        // Filter by price range if applied
        let filteredProducts = productsWithImages;
        if (appliedPriceRange[0] > 0 || appliedPriceRange[1] < 10000) {
          filteredProducts = productsWithImages.filter((product) => {
            const activeTiers =
              product.product_tier_pricing?.filter((tier) => tier.is_active) ||
              [];
            if (activeTiers.length === 0) return false;

            const minPrice = Math.min(...activeTiers.map((tier) => tier.price));
            const maxPrice = Math.max(...activeTiers.map((tier) => tier.price));

            return (
              minPrice >= appliedPriceRange[0] &&
              maxPrice <= appliedPriceRange[1]
            );
          });
        }

        // Apply sorting
        filteredProducts.sort((a, b) => {
          switch (sortBy) {
            case "newest":
              if (a.created_at !== null && b.created_at !== null)
                return (
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
                );
            case "oldest":
              if (a.created_at !== null && b.created_at !== null)
                return (
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
                );
            case "name":
              return a.name.localeCompare(b.name);
            case "price":
              const aPrice =
                a.product_tier_pricing?.find((tier) => tier.is_active)?.price ||
                0;
              const bPrice =
                b.product_tier_pricing?.find((tier) => tier.is_active)?.price ||
                0;
              return aPrice - bPrice;
            default:
              return 0;
          }
        });

        if (page === 0) {
          setProducts(filteredProducts);
        } else {
          setProducts((prev) => [...prev, ...filteredProducts]);
        }

        if (filteredProducts.length < limit) setHasMore(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [searchParams, page, sortBy, appliedPriceRange]);

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
    <div className="rounded-md flex-1 p-2 lg:p-4 bg-background min-h-screen">
      <div className="max-w-full mx-auto px-2 lg:px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">
            Discover products with flexible tier pricing from verified suppliers
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Price Range Filter */}
          <div className="bg-card rounded-lg p-4 border">
            <Label className="text-sm font-medium mb-3 block">
              Price Range
            </Label>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="min-price" className="text-xs">
                    Min:
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder={priceRange[0].toString()}
                    className="w-20 h-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="max-price" className="text-xs">
                    Max:
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={priceRange[1].toString()}
                    className="w-20 h-8 text-xs"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    const newMin = minPrice
                      ? parseInt(minPrice)
                      : priceRange[0];
                    const newMax = maxPrice
                      ? parseInt(maxPrice)
                      : priceRange[1];
                    const newRange = [newMin, newMax];
                    setPriceRange(newRange);
                    setAppliedPriceRange(newRange);
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="h-8 text-xs"
                >
                  Apply
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
              {appliedPriceRange[0] !== priceRange[0] ||
              appliedPriceRange[1] !== priceRange[1] ? (
                <div className="text-xs text-muted-foreground mt-1">
                  Applied: ₹{appliedPriceRange[0]} - ₹{appliedPriceRange[1]}
                </div>
              ) : null}
            </div>
          </div>

          {/* Other Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{products.length} products found</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] rounded-lg">
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
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0 rounded-md"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0 rounded-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
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
