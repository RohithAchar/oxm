"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Description from "@/components/product/product-description";

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Gallery */}
          <div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border">
              <Image
                fill
                src={images[currentImageIdx]?.image_url}
                alt={product.name}
                className="object-cover object-center"
                priority
              />
            </div>
            <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
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

            {/* Details block below */}
            <div className="mt-8 bg-muted/50 rounded-lg p-6 border">
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              <Description text={product.description} />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Supplier</h3>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={business?.profile_avatar_url || "/placeholder-profile.png"} />
                    </Avatar>
                    <div>
                      <p className="font-medium">{business?.business_name}</p>
                      <p className="text-xs text-muted-foreground">{business?.city}</p>
                    </div>
                  </div>
                  <Link href={`/messages/${business?.profile_id}/chat`} className="inline-block mt-3">
                    <Button variant="outline" size="sm">Chat with supplier</Button>
                  </Link>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Key specifications</h3>
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
            <div className="lg:sticky lg:top-20 space-y-6">
              {/* Tier Pricing table */}
              {product.product_tier_pricing?.length > 0 && (
                <div className="border rounded-lg p-4 bg-card">
                  <h3 className="font-medium mb-3">Tier pricing</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {product.product_tier_pricing
                      .slice()
                      .sort((a: any, b: any) => a.quantity - b.quantity)
                      .map((tier: any, idx: number) => (
                        <div key={tier.id ?? idx} className={`rounded-md border px-3 py-2 text-center ${
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
                    <div className="text-2xl font-semibold">₹{unitPrice?.toFixed ? unitPrice.toFixed(2) : unitPrice}</div>
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
                    <div className="text-xl font-semibold">₹{totalPrice.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Buy button */}
              <div className="border rounded-lg p-4 bg-card">
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
    </div>
  );
}


