"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BadgeCheck,
  MapPin,
  MessageCircle,
  Share2,
  Heart,
  ChevronDown,
  ChevronRight,
  Package,
  Check,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Description from "@/components/product/product-description";
import RecentlyViewedTracker from "@/components/recent/RecentlyViewedTracker";
import { useFavorites } from "@/lib/contexts/favorites-context";
import { useFavoriteSuppliers } from "@/lib/contexts/favorite-suppliers-context";
import { shareProduct, getShareUrl, getShareText } from "@/lib/utils/share";
import ShippingAddress from "@/components/product/shipping-address";
import RFQButton from "./RFQButton";

type Color = { id: string; name: string; hex_code: string };
type Size = { id: string; name: string };

export default function ProductViewV2Client({
  product,
  business,
}: {
  product: any;
  business: any;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    addToFavoriteSuppliers,
    removeFromFavoriteSuppliers,
    isFavoriteSupplier,
  } = useFavoriteSuppliers();
  const images = (
    product.product_images?.length
      ? product.product_images
      : [{ id: "1", image_url: "/product-placeholder.png" }]
  ) as {
    id: string;
    image_url: string;
  }[];

  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [colorId, setColorId] = useState<string | undefined>(
    product.product_colors?.[0]?.id
  );
  const [sizeId, setSizeId] = useState<string | undefined>(
    product.product_sizes?.[0]?.id
  );
  const [showSpecs, setShowSpecs] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const sampleQuantity = (product as any).quantity ?? 1;

  const selectedColor: Color | undefined = product.product_colors?.find(
    (c: Color) => c.id === colorId
  );
  const selectedSize: Size | undefined = product.product_sizes?.find(
    (s: Size) => s.id === sizeId
  );

  const activeTier = useMemo(() => {
    const tiers = product.product_tier_pricing || [];
    if (tiers.length === 0) return undefined;
    const sorted = [...tiers].sort((a: any, b: any) => a.quantity - b.quantity);
    let match = sorted[0];
    for (const t of sorted) {
      if (sampleQuantity >= t.quantity) match = t;
    }
    return match;
  }, [product.product_tier_pricing, sampleQuantity]);

  const unitPrice = ((): number => {
    if ((product as any).total_price && sampleQuantity) {
      const calc =
        Number((product as any).total_price) / Number(sampleQuantity);
      if (isFinite(calc)) return calc;
    }
    return activeTier
      ? parseFloat(activeTier.price)
      : Number(product.price_per_unit || 0);
  })();
  const totalPrice = (product as any).total_price
    ? Number((product as any).total_price)
    : unitPrice * sampleQuantity;

  // Dropship mode toggled by URL param
  const searchParams = useSearchParams();
  const dropshipMode = searchParams.get("dropship_available") === "true";

  // Swipe functionality
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentImageIdx < images.length - 1) {
      setCurrentImageIdx(currentImageIdx + 1);
      // Haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
    if (isRightSwipe && currentImageIdx > 0) {
      setCurrentImageIdx(currentImageIdx - 1);
      // Haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  const handleFavorite = () => {
    toggleFavorite(product.id);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleShare = async () => {
    const shareUrl = getShareUrl(product.id, product.name);
    const shareText = getShareText(
      product.name,
      `₹${unitPrice?.toFixed ? unitPrice.toFixed(2) : unitPrice}`
    );

    await shareProduct({
      title: product.name,
      text: shareText,
      url: shareUrl,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Track this product as recently viewed (no UI) */}
      <RecentlyViewedTracker product={product} />

      <div className="max-w-screen-2xl mx-auto">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Image Gallery */}
          <div className="relative -mx-4 sm:mx-0 pt-2 sm:pt-0">
            <div
              className="relative w-full aspect-square overflow-hidden touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                fill
                src={images[currentImageIdx]?.image_url}
                alt={product.name}
                className="object-cover object-center select-none"
                priority
                draggable={false}
              />

              {/* Swipe indicators */}
              {images.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIdx + 1} / {images.length}
                </div>
              )}

              {/* Action buttons below image counter */}
              <div className="absolute top-16 right-4 flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavorite}
                  className="p-2 bg-black/20 hover:bg-black/30 active:scale-95 transition-all duration-150 backdrop-blur-sm"
                >
                  <Heart
                    className={`w-5 h-5 text-white transition-colors duration-200 ${
                      isFavorite(product.id)
                        ? "fill-rose-600 text-rose-600"
                        : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="p-2 bg-black/20 hover:bg-black/30 active:scale-95 transition-all duration-150 backdrop-blur-sm"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
            {/* Image indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      idx === currentImageIdx
                        ? "bg-white scale-125"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="py-4 space-y-4">
            <div>
              <h1 className="text-base font-semibold mb-2 leading-tight">
                {product.name}
              </h1>
              <Description text={product.description} />

              {/* RFQ Button */}
              {!dropshipMode && (
                <div className="mt-4">
                  <RFQButton
                    productId={product.id}
                    productName={product.name}
                    supplierId={business?.profile_id}
                    supplierName={business?.business_name}
                    tierPricingSnapshot={product.product_tier_pricing}
                    productImage={images[0]?.image_url}
                    variant="row"
                    isActive={product.is_active}
                  />
                </div>
              )}
            </div>

            {/* Price section (mobile) - only show MOQ when not in dropship mode */}
            {!dropshipMode
              ? product.product_tier_pricing?.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-medium mb-3">MOQ price</h3>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {product.product_tier_pricing
                        .slice()
                        .sort((a: any, b: any) => a.quantity - b.quantity)
                        .map((tier: any, idx: number) => (
                          <div
                            key={tier.id ?? idx}
                            className={`rounded-lg border px-3 py-2 text-center min-w-[6rem] ${
                              activeTier?.id === tier.id
                                ? "bg-primary/10 border-primary"
                                : "bg-background"
                            }`}
                          >
                            <div className="text-xs text-muted-foreground">
                              {tier.quantity}+
                            </div>
                            <div className="font-semibold text-sm">
                              ₹{tier.price}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              : null}

            {/* Options */}
            {((product.product_colors && product.product_colors.length > 0) ||
              (product.product_sizes && product.product_sizes.length > 0)) && (
              <div className="space-y-4">
                {product.product_colors &&
                  product.product_colors.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Color
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.product_colors.map((c: Color) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setColorId(c.id)}
                            className={`px-4 py-2 rounded-full border text-sm flex items-center gap-2 ${
                              colorId === c.id
                                ? "bg-primary/10 border-primary"
                                : "bg-background"
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: (c as any).hex_code }}
                            />
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {product.product_sizes && product.product_sizes.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.product_sizes.map((s: Size) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSizeId(s.id)}
                          className={`px-4 py-2 rounded-full border text-sm ${
                            sizeId === s.id
                              ? "bg-primary/10 border-primary"
                              : "bg-background"
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Supplier Info */}
            <div className="bg-muted/50 rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">Supplier</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${
                    isFavoriteSupplier(business?.id)
                      ? "text-rose-600 hover:text-rose-700"
                      : "text-slate-400 hover:text-rose-600"
                  }`}
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(100);
                    if (business) {
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
                    }
                  }}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isFavoriteSupplier(business?.id) ? "fill-current" : ""
                    }`}
                  />
                </Button>
              </div>
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={
                      business?.profile_avatar_url || "/placeholder-profile.png"
                    }
                  />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">
                      {business?.business_name}
                    </p>
                    {(business?.status === "APPROVED" ||
                      business?.is_verified) && (
                      <BadgeCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{business?.city}</span>
                    </div>
                    <div>Trust Score: 500 • Rating: 4.5/5</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/messages/${business?.profile_id}/chat`}
                      className="flex-1"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-full transition-all duration-200 active:scale-95"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </Link>
                    <Link href={`/${business?.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-3 py-2 rounded-full transition-all duration-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        title="View Supplier Profile"
                      >
                        <span className="text-xs font-medium">Profile</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Perfect UI Price Section (mobile) */}
            {dropshipMode ? (
              <div className="bg-card rounded-lg border shadow-sm">
                {/* Top Row - Dropship, Adjust, Price */}
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-foreground">
                      Dropship
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-foreground">
                      Adjust in Bulk
                    </span>
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-foreground">
                      ₹{(product as any)?.dropship_price ?? unitPrice}
                    </div>
                  </div>
                </div>

                {/* Middle Row - Quantity and Buy */}
                <div className="flex items-center justify-between p-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-0.5">
                      Quantity
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      1 unit
                    </div>
                  </div>
                  <Button
                    className="px-4 py-1.5 text-sm font-medium"
                    disabled={!product.is_active}
                    onClick={() => {
                      if (navigator.vibrate) navigator.vibrate(200);
                      console.log("Buy (dropship)", {
                        productId: product.id,
                        colorId,
                        sizeId,
                      });
                    }}
                  >
                    {product.is_active ? "Buy" : "Out of Stock"}
                  </Button>
                </div>

                {/* Free Delivery Banner */}
                <div className="bg-muted px-3 py-2 rounded-b-lg">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                      <span className="text-primary font-semibold text-xs">
                        Free Delivery
                      </span>
                      <span className="text-muted-foreground text-xs ml-1">
                        on all orders
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              product?.is_sample_available && (
                <div className="bg-card rounded-lg border shadow-sm">
                  {/* Top Row - Sample Available, Bulk Adjustment, Price */}
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">
                        Sample Available
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-foreground">
                        Adjust in Bulk
                      </span>
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        ₹{unitPrice?.toFixed ? unitPrice.toFixed(2) : unitPrice}
                      </div>
                    </div>
                  </div>

                  {/* Middle Row - Minimum Order and Order Sample Button */}
                  <div className="flex items-center justify-between p-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">
                        Minimum Order
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        3 units
                      </div>
                    </div>
                    <Button
                      className="px-4 py-1.5 text-sm font-medium"
                      disabled={!product.is_active}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(200);
                        console.log("Order Sample clicked", {
                          productId: product.id,
                          colorId,
                          sizeId,
                          quantity: sampleQuantity,
                          unitPrice,
                          totalPrice,
                        });
                      }}
                    >
                      {product.is_active ? "Order Sample" : "Out of Stock"}
                    </Button>
                  </div>

                  {/* Free Delivery Banner */}
                  <div className="bg-muted px-3 py-2 rounded-b-lg">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <span className="text-primary font-semibold text-xs">
                          Free Delivery
                        </span>
                        <span className="text-muted-foreground text-xs ml-1">
                          on all orders
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Shipping Address */}
            <div className="bg-muted/50 rounded-lg p-4">
              <ShippingAddress />
            </div>

            {/* Specifications */}
            {product.product_specifications?.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4">
                <button
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="flex items-center justify-between w-full transition-colors duration-200 hover:bg-muted/30 rounded-md p-2 -m-2"
                >
                  <h3 className="font-medium">Specifications</h3>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showSpecs ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showSpecs ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="mt-3 space-y-2">
                    {product.product_specifications.map((s: any) => (
                      <div
                        key={s.id}
                        className="flex justify-between text-sm py-1"
                      >
                        <span className="text-muted-foreground">
                          {s.spec_name}
                        </span>
                        <span className="font-medium">
                          {s.spec_value}
                          {s.spec_unit && (
                            <span className="text-muted-foreground ml-1">
                              {s.spec_unit}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block px-4 sm:px-5 py-5 sm:py-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Left: Gallery */}
            <div>
              <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden border">
                <Image
                  fill
                  src={images[currentImageIdx]?.image_url}
                  alt={product.name}
                  className="object-cover object-center"
                  priority
                />

                {/* Desktop action buttons overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavorite}
                    className="p-2 bg-black/20 hover:bg-black/30 active:scale-95 transition-all duration-150 backdrop-blur-sm"
                  >
                    <Heart
                      className={`w-5 h-5 text-white transition-colors duration-200 ${
                        isFavorite(product.id)
                          ? "fill-rose-600 text-rose-600"
                          : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="p-2 bg-black/20 hover:bg-black/30 active:scale-95 transition-all duration-150 backdrop-blur-sm"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </Button>
                </div>
              </div>
              {/* Thumbnails: horizontal scroll on mobile, grid on md+ */}
              <div className="mt-3">
                <div className="hidden md:grid grid-cols-6 lg:grid-cols-8 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id ?? idx}
                      type="button"
                      onClick={() => setCurrentImageIdx(idx)}
                      className={`relative aspect-square rounded-md overflow-hidden border focus:outline-none ${
                        idx === currentImageIdx ? "ring-2 ring-primary" : ""
                      }`}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <Image
                        fill
                        src={img.image_url}
                        alt="thumb"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Details block below */}
              <div className="mt-6 sm:mt-8 bg-muted/50 rounded-lg p-4 sm:p-6 border">
                <h1 className="text-sm sm:text-base font-semibold mb-1 tracking-tight leading-snug">
                  {product.name}
                </h1>
                <Description text={product.description} />

                {/* RFQ Button */}
                {!dropshipMode && (
                  <div className="mt-4">
                    <RFQButton
                      productId={product.id}
                      productName={product.name}
                      supplierId={business?.profile_id}
                      supplierName={business?.business_name}
                      tierPricingSnapshot={product.product_tier_pricing}
                      productImage={images[0]?.image_url}
                      variant="row"
                      isActive={product.is_active}
                    />
                  </div>
                )}

                {/* RFQ section (desktop) */}
                <div className="mt-4">
                  <div className="border rounded-lg p-4 bg-card relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Supplier</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${
                          isFavoriteSupplier(business?.id)
                            ? "text-rose-600 hover:text-rose-700"
                            : "text-slate-400 hover:text-rose-600"
                        }`}
                        onClick={() => {
                          if (navigator.vibrate) navigator.vibrate(100);
                          if (business) {
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
                          }
                        }}
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isFavoriteSupplier(business?.id)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={
                            business?.profile_avatar_url ||
                            "/placeholder-profile.png"
                          }
                        />
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm sm:text-base truncate">
                            {business?.business_name}
                          </p>
                          {(business?.status === "APPROVED" ||
                            business?.is_verified) && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-700 font-medium">
                              <BadgeCheck className="w-4 h-4 text-blue-600" />
                              verified
                            </span>
                          )}
                        </div>
                        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm">
                          {business?.gst_number && (
                            <div className="truncate">
                              <span className="text-muted-foreground">
                                gst :
                              </span>
                              <span className="ml-1 font-medium">
                                {business.gst_number}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-xs sm:text-sm">
                              {business?.city}
                            </span>
                          </div>
                          <div className="truncate">
                            <span className="text-muted-foreground">
                              Trust score
                            </span>
                            <span className="ml-1 font-medium">500</span>
                          </div>
                          <div className="truncate">
                            <span className="text-muted-foreground">
                              rating
                            </span>
                            <span className="ml-1 font-medium">4.5/ 5</span>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            href={`/messages/${business?.profile_id}/chat`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1 rounded-full px-4"
                            >
                              <MessageCircle className="w-4 h-4" />
                              CHAT NOW
                            </Button>
                          </Link>
                          <Link
                            href={`/${business?.id}`}
                            className="inline-block"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="px-3 py-2 rounded-full transition-all duration-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center gap-1"
                              title="View Supplier Profile"
                            >
                              <span className="text-xs font-medium">
                                Profile
                              </span>
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key specifications container */}
                <div className="mt-4 sm:mt-6 grid grid-cols-1">
                  <div className="border rounded-lg p-4 bg-card">
                    <h3 className="text-sm font-medium mb-3">
                      Key specifications
                    </h3>
                    <div className="space-y-1 text-sm">
                      {product.product_specifications
                        ?.slice(0, 6)
                        .map((s: any) => (
                          <div key={s.id} className="flex justify-between">
                            <span className="text-muted-foreground">
                              {s.spec_name}
                            </span>
                            <span className="font-medium">
                              {s.spec_value}
                              {s.spec_unit && (
                                <span className="text-muted-foreground ml-1">
                                  {s.spec_unit}
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sticky purchase panel */}
            <div className="lg:pl-2">
              <div className="space-y-4 sm:space-y-6 lg:sticky lg:top-20">
                {/* Shipping Address */}
                <div className="border rounded-lg p-4 bg-card">
                  <ShippingAddress />
                </div>

                {/* MOQ price table */}
                {!dropshipMode && product.product_tier_pricing?.length > 0 && (
                  <div className="border rounded-lg p-4 bg-card">
                    <h3 className="font-medium mb-3">MOQ price</h3>
                    {/* Horizontal scroll on mobile, grid on md+ */}
                    <div className="flex md:grid md:grid-cols-3 gap-2 text-sm overflow-x-auto no-scrollbar">
                      {product.product_tier_pricing
                        .slice()
                        .sort((a: any, b: any) => a.quantity - b.quantity)
                        .map((tier: any, idx: number) => (
                          <div
                            key={tier.id ?? idx}
                            className={`rounded-md border px-3 py-2 text-center min-w-[7rem] md:min-w-0 ${
                              activeTier?.id === tier.id
                                ? "bg-primary/10 border-primary"
                                : "bg-background"
                            }`}
                          >
                            <div className="text-xs text-muted-foreground">
                              {tier.quantity}+
                            </div>
                            <div className="font-semibold">₹{tier.price}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                {((product.product_colors &&
                  product.product_colors.length > 0) ||
                  (product.product_sizes &&
                    product.product_sizes.length > 0)) && (
                  <div className="border rounded-lg p-4 bg-card space-y-4">
                    {product.product_colors &&
                      product.product_colors.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                            Color
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.product_colors.map((c: Color) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => setColorId(c.id)}
                                className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-2 ${
                                  colorId === c.id
                                    ? "bg-primary/10 border-primary"
                                    : "bg-background"
                                }`}
                              >
                                <span
                                  className="w-4 h-4 rounded"
                                  style={{
                                    backgroundColor: (c as any).hex_code,
                                  }}
                                />
                                {c.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {product.product_sizes &&
                      product.product_sizes.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                            Size
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.product_sizes.map((s: Size) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setSizeId(s.id)}
                                className={`px-3 py-1.5 rounded-full border text-sm ${
                                  sizeId === s.id
                                    ? "bg-primary/10 border-primary"
                                    : "bg-background"
                                }`}
                              >
                                {s.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Desktop pricing: Dropship vs Sample section */}
                {dropshipMode ? (
                  <div className="bg-card rounded-lg border shadow-sm">
                    {/* Top Row - Dropship, Adjust, Price */}
                    <div className="flex items-center justify-between p-6 border-b">
                      <div className="flex items-center gap-3">
                        <Truck className="w-6 h-6 text-primary" />
                        <span className="text-base font-medium text-foreground">
                          Dropship
                        </span>
                      </div>
                      <div className="flex items-center gap-3 bg-secondary px-4 py-2 rounded-full">
                        <span className="text-base font-medium text-foreground">
                          Adjust in Bulk
                        </span>
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground">
                          ₹{(product as any)?.dropship_price ?? unitPrice}
                        </div>
                      </div>
                    </div>
                    {/* Middle Row - Quantity and Buy Button */}
                    <div className="flex items-center justify-between p-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Quantity
                        </div>
                        <div className="text-base font-medium text-foreground">
                          1 unit
                        </div>
                      </div>
                      <div className="text-right">
                        <Button
                          className="px-8 py-3 rounded-lg font-medium text-base"
                          onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(200);
                            console.log("Buy (dropship)", {
                              productId: product.id,
                              colorId,
                              sizeId,
                            });
                          }}
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                    {/* Free Delivery Banner */}
                    <div className="bg-muted px-6 py-4 rounded-b-lg">
                      <div className="flex items-center gap-4">
                        <Truck className="w-7 h-7 text-primary" />
                        <div>
                          <span className="text-primary font-semibold text-base">
                            Free Delivery
                          </span>
                          <span className="text-muted-foreground text-base ml-2">
                            on all orders
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  product?.is_sample_available && (
                    <div className="bg-card rounded-lg border shadow-sm">
                      <div className="flex items-center justify-between p-6 border-b">
                        <div className="flex items-center gap-3">
                          <Package className="w-6 h-6 text-primary" />
                          <span className="text-base font-medium text-foreground">
                            Sample Available
                          </span>
                        </div>
                        <div className="flex items-center gap-3 bg-secondary px-4 py-2 rounded-full">
                          <span className="text-base font-medium text-foreground">
                            Adjust in Bulk
                          </span>
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-foreground">
                            ₹
                            {unitPrice?.toFixed
                              ? unitPrice.toFixed(2)
                              : unitPrice}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-6">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Minimum Order
                          </div>
                          <div className="text-base font-medium text-foreground">
                            3 units
                          </div>
                        </div>
                        <Button
                          className="px-8 py-3 rounded-lg font-medium text-base"
                          disabled={!product.is_active}
                          onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(200);
                            console.log("Order Sample clicked", {
                              productId: product.id,
                              colorId,
                              sizeId,
                              quantity: sampleQuantity,
                              unitPrice,
                              totalPrice,
                            });
                          }}
                        >
                          {product.is_active ? "Order Sample" : "Out of Stock"}
                        </Button>
                      </div>
                      <div className="bg-muted px-6 py-4 rounded-b-lg">
                        <div className="flex items-center gap-4">
                          <Truck className="w-7 h-7 text-primary" />
                          <div>
                            <span className="text-primary font-semibold text-base">
                              Free Delivery
                            </span>
                            <span className="text-muted-foreground text-base ml-2">
                              on all orders
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {/* Buy button removed for large screens to avoid duplication */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
