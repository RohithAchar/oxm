import {
  MapPin,
  Package,
  Ruler,
  Weight,
  CheckCircle,
  MessageCircle,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ImageCarousel } from "@/components/product/image-carousel";
import Description from "@/components/product/product-description";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BuyPanel from "@/components/product/BuyPanel";
import { Badge } from "@/components/ui/badge";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getProductByIdCached } from "@/lib/controller/product/productOperations";
import Link from "next/link";
import RecentlyViewedTracker from "@/components/recent/RecentlyViewedTracker";
// import MobileHeader from "@/components/product/mobile-header";

export const ProductView = async ({ id }: { id: string }) => {
  const data = await getProductByIdCached(id);
  const business = await getBusiness(data.supplier_id!);

  if (!data) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* <MobileHeader /> */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top Bar (Mobile) */}
        <div className="flex md:hidden items-center gap-4 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <form action="/search" className="flex-1 flex items-center gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input name="q" placeholder="Search products" className="pl-9" />
            </div>
            <Button type="submit" variant="default">
              Search
            </Button>
          </form>
        </div>
        <RecentlyViewedTracker
          product={{
            id: data.id,
            name: data.name,
            product_images: data.product_images,
            brand: data.brand,
            is_verified: business?.is_verified,
            is_sample_available: data.is_sample_available,
            priceAndQuantity: data.product_tier_pricing.map((tier) => ({
              quantity: tier.quantity,
              price: parseFloat(tier.price),
            })),
            supplier_name: business?.business_name,
          }}
        />
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div>
            <ImageCarousel
              images={
                data.product_images || [
                  { id: "1", image_url: "/product-placeholder.png" },
                ]
              }
            />
          </div>

          {/* Product Info & Buy Panel */}
          <div className="space-y-8">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-4">
                {data.name}
              </h1>
              <Description text={data.description} />
            </div>

            {/* Buy Panel */}
            <BuyPanel data={data} />

            {/* Sample Availability */}
            {data.is_sample_available && (
              <div className="bg-secondary/50 border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-medium text-foreground">
                    Sample Available
                  </h3>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Minimum Order
                    </p>
                    <p className="font-medium text-foreground">
                      {data.quantity} units
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-foreground">
                      ₹{data.total_price}
                    </p>
                    <Button size="sm" className="mt-2">
                      Order Sample
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Supplier Info */}
          <div className="bg-muted/50 rounded-lg p-6 border">
            <h3 className="font-medium text-foreground mb-4">Supplier</h3>
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={
                    business?.profile_avatar_url || "/placeholder-profile.png"
                  }
                  alt="Supplier"
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground">
                    {business?.business_name}
                  </p>
                  {business?.is_verified && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {business?.city}
                </p>
              </div>
            </div>
            <Link href={`/messages/${business.profile_id}/chat`}>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Supplier
              </Button>
            </Link>
          </div>

          {/* Specifications */}
          <div className="bg-muted/50 rounded-lg p-6 border">
            <h3 className="font-medium text-foreground mb-4">
              Product Details
            </h3>
            <div className="space-y-3">
              {data.product_specifications.map((spec) => (
                <div
                  key={spec.id}
                  className="flex justify-between items-center py-1"
                >
                  <span className="text-sm text-muted-foreground">
                    {spec.spec_name}
                  </span>
                  <span className="font-medium text-foreground">
                    {spec.spec_value}
                    {spec.spec_unit && (
                      <span className="text-muted-foreground ml-1">
                        {spec.spec_unit}
                      </span>
                    )}
                  </span>
                </div>
              ))}

              {/* Colors */}
              {data.product_colors && data.product_colors.length > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Colors</span>
                  <div className="flex gap-1">
                    {data.product_colors.map((color: any) => (
                      <div
                        key={color.id}
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: color.hex_code }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {data.product_sizes && data.product_sizes.length > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Sizes</span>
                  <div className="flex gap-1">
                    {data.product_sizes.map((size: any) => (
                      <Badge
                        key={size.id}
                        variant="outline"
                        className="text-xs"
                      >
                        {size.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-muted/50 rounded-lg p-6 border">
            <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Dimensions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Length
                </p>
                <p className="text-lg font-medium text-foreground">
                  {data.length}
                  <span className="text-sm text-muted-foreground ml-1">cm</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Width
                </p>
                <p className="text-lg font-medium text-foreground">
                  {data.breadth}
                  <span className="text-sm text-muted-foreground ml-1">cm</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Height
                </p>
                <p className="text-lg font-medium text-foreground">
                  {data.height}
                  <span className="text-sm text-muted-foreground ml-1">cm</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1 flex items-center justify-center gap-1">
                  <Weight className="w-3 h-3" />
                  Weight
                </p>
                <p className="text-lg font-medium text-foreground">
                  {data.weight}
                  <span className="text-sm text-muted-foreground ml-1">kg</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Pricing Tiers */}
        {data.product_tier_pricing.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-medium text-foreground mb-6">
              Bulk Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.product_tier_pricing.map((tier, idx) => (
                <div
                  key={tier.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Tier {idx + 1}
                    </Badge>
                    <span className="text-xl font-semibold text-foreground">
                      ₹{tier.price}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Minimum Order
                    </p>
                    <p className="font-medium text-foreground">
                      {tier.quantity}+ units
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      per unit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
