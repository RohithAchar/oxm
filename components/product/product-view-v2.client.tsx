"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BadgeCheck, MapPin, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Description from "@/components/product/product-description";
import RecentlyViewedTracker from "@/components/recent/RecentlyViewedTracker";

type Color = { id: string; name: string; hex_code: string };
type Size = { id: string; name: string };

export default function ProductViewV2Client({
  product,
  business,
}: {
  product: any;
  business: any;
}) {
  const images = (product.product_images?.length
    ? product.product_images
    : [{ id: "1", image_url: "/product-placeholder.png" }]) as {
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
      const calc = Number((product as any).total_price) / Number(sampleQuantity);
      if (isFinite(calc)) return calc;
    }
    return activeTier ? parseFloat(activeTier.price) : Number(product.price_per_unit || 0);
  })();
  const totalPrice = (product as any).total_price ? Number((product as any).total_price) : unitPrice * sampleQuantity;

  return (
    <div className="min-h-screen bg-background">
      {/* Track this product as recently viewed (no UI) */}
      <RecentlyViewedTracker product={product} />
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-5 sm:py-8 pb-10">
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
            </div>
            {/* Thumbnails: horizontal scroll on mobile, grid on md+ */}
            <div className="mt-3">
              <div className="flex md:hidden gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id ?? idx}
                    type="button"
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`relative w-16 h-16 shrink-0 rounded-md overflow-hidden border focus:outline-none ${
                      idx === currentImageIdx ? "ring-2 ring-primary" : ""
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image fill src={img.image_url} alt="thumb" className="object-cover" />
                  </button>
                ))}
              </div>
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
                    <Image fill src={img.image_url} alt="thumb" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details block below */}
            <div className="mt-6 sm:mt-8 bg-muted/50 rounded-lg p-4 sm:p-6 border">
              <h1 className="text-lg sm:text-xl font-semibold mb-1 tracking-tight leading-snug">{product.name}</h1>
              <Description text={product.description} />

              {/* Supplier container */}
              <div className="mt-4 sm:mt-6">
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-medium mb-2">Supplier</h3>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={business?.profile_avatar_url || "/placeholder-profile.png"} />
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm sm:text-base truncate">{business?.business_name}</p>
                        {(business?.status === "APPROVED" || business?.is_verified) && (
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                            <BadgeCheck className="w-4 h-4 text-primary" />
                            verified
                          </span>
                        )}
                      </div>
                      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm">
                        {business?.gst_number && (
                          <div className="truncate">
                            <span className="text-muted-foreground">gst :</span>
                            <span className="ml-1 font-medium">{business.gst_number}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-xs sm:text-sm">{business?.city}</span>
                        </div>
                        <div className="truncate">
                          <span className="text-muted-foreground">Trust score</span>
                          <span className="ml-1 font-medium">500</span>
                        </div>
                        <div className="truncate">
                          <span className="text-muted-foreground">rating</span>
                          <span className="ml-1 font-medium">4.5/ 5</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Link href={`/messages/${business?.profile_id}/chat`} className="inline-block">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-1 rounded-full px-4">
                            <MessageCircle className="w-4 h-4" />
                            CHAT NOW
                          </Button>
                        </Link>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4">
                          Get Best price
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key specifications container */}
              <div className="mt-4 sm:mt-6 grid grid-cols-1">
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-medium mb-3">Key specifications</h3>
                  <div className="space-y-1 text-sm">
                    {product.product_specifications?.slice(0, 6).map((s: any) => (
                      <div key={s.id} className="flex justify-between">
                        <span className="text-muted-foreground">{s.spec_name}</span>
                        <span className="font-medium">
                          {s.spec_value}
                          {s.spec_unit && <span className="text-muted-foreground ml-1">{s.spec_unit}</span>}
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
              {/* Tier Pricing table */}
              {product.product_tier_pricing?.length > 0 && (
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-3">Tier pricing</h3>
                  {/* Horizontal scroll on mobile, grid on md+ */}
                  <div className="flex md:grid md:grid-cols-3 gap-2 text-sm overflow-x-auto no-scrollbar">
                    {product.product_tier_pricing
                      .slice()
                      .sort((a: any, b: any) => a.quantity - b.quantity)
                      .map((tier: any, idx: number) => (
                        <div key={tier.id ?? idx} className={`rounded-md border px-3 py-2 text-center min-w-[7rem] md:min-w-0 ${
                          activeTier?.id === tier.id ? "bg-primary/10 border-primary" : "bg-background"
                        }`}>
                          <div className="text-xs text-muted-foreground">{tier.quantity}+</div>
                          <div className="font-semibold">₹{tier.price}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Options */}
              {((product.product_colors && product.product_colors.length > 0) ||
                (product.product_sizes && product.product_sizes.length > 0)) && (
                <div className="border rounded-lg p-4 bg-card space-y-4">
                  {product.product_colors && product.product_colors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Color</p>
                      <div className="flex flex-wrap gap-2">
                        {product.product_colors.map((c: Color) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setColorId(c.id)}
                            className={`px-3 py-1.5 rounded-full border text-sm flex items-center gap-2 ${
                              colorId === c.id ? "bg-primary/10 border-primary" : "bg-background"
                            }`}
                          >
                            <span className="w-4 h-4 rounded" style={{ backgroundColor: (c as any).hex_code }} />
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.product_sizes && product.product_sizes.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Size</p>
                      <div className="flex flex-wrap gap-2">
                        {product.product_sizes.map((s: Size) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSizeId(s.id)}
                            className={`px-3 py-1.5 rounded-full border text-sm ${
                              sizeId === s.id ? "bg-primary/10 border-primary" : "bg-background"
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

              {/* Price with fixed sample quantity and free delivery */}
              <div className="border rounded-lg p-4 bg-card space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Price per unit</div>
                    <div className="text-lg sm:text-xl font-semibold leading-tight">₹{unitPrice?.toFixed ? unitPrice.toFixed(2) : unitPrice}</div>
                  </div>
                  <Badge variant="secondary">Free delivery</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground">Qty</div>
                  <div className="px-3 py-1.5 border rounded-md bg-background text-sm font-medium select-none">
                    {sampleQuantity}
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="text-base sm:text-lg font-semibold">₹{totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Buy button */}
              <div className="border rounded-lg p-3 sm:p-4 bg-card hidden lg:block">
                <Button className="w-full" size="lg" onClick={() => {
                  // Just log for now as requested
                  console.log("Buy clicked", {
                    productId: product.id,
                    colorId,
                    sizeId,
                    quantity: sampleQuantity,
                    unitPrice,
                    totalPrice,
                  });
                }}>Buy now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating buy bar (polished) */}
      <div className="lg:hidden fixed inset-x-0 bottom-20 z-40 flex justify-center px-4">
        <div className="flex items-center gap-3 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border rounded-full shadow-lg px-4 py-3 max-w-md w-full">
          <div className="flex-1">
            <div className="text-[11px] text-muted-foreground">Total • Qty {sampleQuantity}</div>
            <div className="text-sm font-semibold leading-none">₹{totalPrice.toFixed(2)}</div>
          </div>
          <Button
            size="sm"
            className="rounded-full px-5 py-2"
            onClick={() => {
              console.log("Buy clicked (mobile)", {
                productId: product.id,
                colorId,
                sizeId,
                quantity: sampleQuantity,
                unitPrice,
                totalPrice,
              });
            }}
          >
            Buy
          </Button>
        </div>
      </div>
    </div>
  );
}


