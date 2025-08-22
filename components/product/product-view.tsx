import { MapPin, Package, Ruler, Weight, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ImageCarousel } from "@/components/product/image-carousel";
import Description from "@/components/product/product-description";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getProductByIdCached } from "@/lib/controller/product/productOperations";
import Link from "next/link";

export const ProductView = async ({ id }: { id: string }) => {
  const data = await getProductByIdCached(id);
  const business = await getBusiness(data.supplier_id!);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
          <p className="text-muted-foreground mt-2">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <ImageCarousel
              images={
                data.product_images || [
                  { id: "1", image_url: "/product-placeholder.png" },
                ]
              }
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title and Description */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {data.name}
              </h1>
              <Description text={data.description} />
            </div>

            {/* Sample Pricing - Priority placement */}
            {data.is_sample_available && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-primary" />
                    Sample Available
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-lg">
                        {data.quantity} units
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Minimum Order Quantity
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ₹{data.total_price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Price
                      </p>
                    </div>
                  </div>
                  <Button className="w-full h-12 text-lg font-semibold">
                    Order Sample Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tier Pricing */}
            {data.product_tier_pricing.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Bulk Pricing Tiers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.product_tier_pricing.map((tier, idx) => (
                    <div
                      key={tier.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="px-3 py-1">
                          Tier {idx + 1}
                        </Badge>
                        <div>
                          <p className="font-semibold">
                            {tier.quantity}+ units
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Minimum Order
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">₹{tier.price}</p>
                        <p className="text-sm text-muted-foreground">
                          per unit
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Bottom Section - Full Width Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={
                      business?.profile_avatar_url || "/placeholder-profile.png"
                    }
                    alt="Supplier Avatar"
                  />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">
                      {business?.business_name}
                    </p>
                    {business?.is_verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    {business?.city}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={"default"}>
                <Link href={`/messages/${business.profile_id}/chat`}>
                  Chat with Supplier
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Product Specifications */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.product_specifications.map((spec, index) => (
                <div key={spec.id}>
                  <div className="flex items-center justify-between py-2">
                    <p className="font-medium text-foreground/80">
                      {spec.spec_name}
                    </p>
                    <p className="font-semibold">
                      {spec.spec_value}
                      {spec.spec_unit && (
                        <span className="text-sm text-muted-foreground ml-1">
                          {spec.spec_unit}
                        </span>
                      )}
                    </p>
                  </div>
                  {index < data.product_specifications.length - 1 && (
                    <Separator />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Ruler className="w-5 h-5" />
                Dimensions & Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Length</p>
                  <p className="font-semibold text-lg">{data.length} cm</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Width</p>
                  <p className="font-semibold text-lg">{data.breadth} cm</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-semibold text-lg">{data.height} cm</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Weight className="w-3 h-3" />
                    Weight
                  </p>
                  <p className="font-semibold text-lg">{data.weight} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
