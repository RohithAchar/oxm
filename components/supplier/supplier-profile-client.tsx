"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/home/product-card";
import { useFavoriteSuppliers } from "@/lib/contexts/favorite-suppliers-context";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Package,
  Truck,
  Shield,
  CheckCircle,
  MessageCircle,
  Heart,
  Building2,
  Users,
  TrendingUp,
  Award,
  Clock,
  Globe,
  FileText,
  ArrowLeft,
} from "lucide-react";

interface SupplierProfileClientProps {
  business: any;
  products: any[];
}

export default function SupplierProfileClient({
  business,
  products,
}: SupplierProfileClientProps) {
  const {
    addToFavoriteSuppliers,
    removeFromFavoriteSuppliers,
    isFavoriteSupplier,
  } = useFavoriteSuppliers();
  const [activeTab, setActiveTab] = useState("products");

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Calculate real stats from data
  const totalProducts = safeProducts.length;
  const verifiedProducts = safeProducts.filter((p) => p.is_verified).length;
  const sampleAvailableProducts = safeProducts.filter(
    (p) => p.is_sample_available
  ).length;

  // Calculate average price from products
  const averagePrice =
    safeProducts.length > 0
      ? safeProducts.reduce((sum, p) => {
          const price = parseFloat(
            p.price_per_unit?.replace(/[^\d.-]/g, "") || "0"
          );
          return sum + price;
        }, 0) / safeProducts.length
      : 0;

  // Calculate business age
  const businessAge = business.created_at
    ? Math.floor(
        (new Date().getTime() - new Date(business.created_at).getTime()) /
          (1000 * 60 * 60 * 24 * 365)
      )
    : 0;

  // Real business verification status
  const isVerified = business.is_verified || business.status === "APPROVED";
  const hasGST = !!business.gst_number;
  const hasPhone = !!business.phone;
  const hasAlternatePhone = !!business.alternate_phone;

  // Dummy trust score (placeholder logic until real system exists)
  const trustScore = Math.min(
    100,
    (isVerified ? 60 : 30) +
      (hasGST ? 20 : 0) +
      (hasPhone ? 10 : 0) +
      (verifiedProducts > 0 ? 10 : 0)
  );

  // Dummy rating (placeholder until real ratings exist)
  const rating = 4.5;

  // Dummy response rate (placeholder until real metric exists)
  const responseRate = 92;

  const handleFavoriteToggle = () => {
    if (isFavoriteSupplier(business.id)) {
      removeFromFavoriteSuppliers(business.id);
    } else {
      addToFavoriteSuppliers({
        id: business.id,
        business_name: business.business_name,
        profile_avatar_url: business.profile_avatar_url,
        city: business.city,
        is_verified: business.is_verified,
        profile_id: business.profile_id,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Native App Style */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white mt-4">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Top Navigation - Native App Style */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-2">
              {isVerified && (
                <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* Supplier Profile - Native App Style */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white/30 shadow-2xl">
                <AvatarImage
                  src={
                    business.profile_avatar_url || "/placeholder-profile.png"
                  }
                  alt={business.business_name}
                />
                <AvatarFallback className="text-2xl bg-white/20 text-white">
                  {business.business_name?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                {business.business_name}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  {business.type || "Supplier"}
                </Badge>
                {business.city && (
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {business.city}, {business.state}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>GST:</span>
                  <span className="font-medium text-white">
                    {business.gst_number || "—"}
                  </span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{responseRate}% Response rate</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Native App Style */}
            <div className="flex gap-3 w-full max-w-sm pt-2">
              <Link
                href={`/messages/${business.profile_id}/chat`}
                className="flex-1"
              >
                <Button className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 rounded-xl shadow-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact
                </Button>
              </Link>
              <Button
                onClick={handleFavoriteToggle}
                className={`flex-1 py-3 rounded-xl font-semibold ${
                  isFavoriteSupplier(business.id)
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                <Heart
                  className={`w-5 h-5 mr-2 ${
                    isFavoriteSupplier(business.id) ? "fill-current" : ""
                  }`}
                />
                {isFavoriteSupplier(business.id) ? "Favorited" : "Favorite"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Native App Style */}
      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar - Stats & Info */}
            <div className="space-y-4 md:space-y-6">
              {/* Business Stats - Native App Style */}
              <Card className="shadow-sm border-0 bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Business Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {totalProducts}
                      </div>
                      <div className="text-sm text-blue-700 font-medium">
                        Total Products
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {trustScore}
                      </div>
                      <div className="text-sm text-green-700 font-medium">
                        Trust score
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {sampleAvailableProducts}
                      </div>
                      <div className="text-sm text-purple-700 font-medium">
                        Samples
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {rating.toFixed(1)}
                      </div>
                      <div className="text-sm text-orange-700 font-medium">
                        Ratings
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Information - Native App Style */}
              <Card className="shadow-sm border-0 bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Business Type
                    </label>
                    <p className="text-foreground">
                      {business.type || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      GST Number
                    </label>
                    <p className="text-foreground font-mono">
                      {business.gst_number || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <p className="text-foreground">
                      {business.business_address}
                    </p>
                    <p className="text-muted-foreground">
                      {business.city}, {business.state} - {business.pincode}
                    </p>
                  </div>

                  {averagePrice > 0 && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Average Product Price
                      </label>
                      <p className="text-foreground">
                        ₹{averagePrice.toFixed(2)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Trust & Safety - Native App Style */}
              <Card className="shadow-sm border-0 bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Trust & Safety
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    {isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Shield className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-foreground">
                      {isVerified
                        ? "Verified Business"
                        : "Business Not Verified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasGST ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Shield className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-foreground">
                      {hasGST ? "GST Registered" : "GST Not Provided"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-foreground">
                      Secure Payments
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-foreground">
                      Reliable Shipping
                    </span>
                  </div>
                  {hasPhone && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Contact Available</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Products & Tabs - Native App Style */}
            <div className="lg:col-span-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-auto bg-card shadow-sm rounded-xl p-1">
                  <TabsTrigger
                    value="products"
                    className="text-sm font-medium py-3 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <span className="hidden sm:inline">
                      Products ({totalProducts})
                    </span>
                    <span className="sm:hidden">Products</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="about"
                    className="text-sm font-medium py-3 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="text-sm font-medium py-3 rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="mt-4 md:mt-6">
                  {safeProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                      {safeProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          brand={product.brand || ""}
                          supplierName={business.business_name}
                          imageUrl={product.imageUrl as string}
                          priceAndQuantity={product.priceAndQuantity}
                          is_verified={product.is_verified}
                          hasSample={product.is_sample_available}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="w-16 h-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          No products available
                        </h3>
                        <p className="text-muted-foreground text-center">
                          This supplier hasn't added any products yet.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="about" className="mt-4 md:mt-6">
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg font-semibold mb-4 text-foreground">
                        About {business.business_name}
                      </h3>
                      {business.message ? (
                        <p className="text-foreground leading-relaxed text-sm md:text-base">
                          {business.message}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic text-sm md:text-base">
                          No description provided by this supplier.
                        </p>
                      )}

                      <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Business Details
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                Type:
                              </span>{" "}
                              {business.type || "Not specified"}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Location:
                              </span>{" "}
                              {business.city}, {business.state}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Established:
                              </span>{" "}
                              {business.created_at
                                ? new Date(
                                    business.created_at
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                : "Unknown"}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Status:
                              </span>{" "}
                              {business.status || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Contact Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                GST:
                              </span>{" "}
                              {business.gst_number || "Not provided"}
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Address:
                              </span>{" "}
                              {business.business_address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-12">
                        <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Reviews Coming Soon
                        </h3>
                        <p className="text-muted-foreground">
                          Customer reviews will be available here once the
                          feature is implemented.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
