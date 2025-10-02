"use client";

import { useEffect, useState } from "react";
import { useBagStore } from "@/stores/bag";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertCircle } from "lucide-react";

type Color = { id: string; name: string; hex_code: string };
type Size = { id: string; name: string };

export default function BuyPanel({
  data,
}: {
  data: {
    id: string;
    name: string;
    product_images?: { image_url: string }[];
    price_per_unit?: number | string | null;
    product_colors?: Color[];
    product_sizes?: Size[];
    is_active?: boolean | null;
  };
}) {
  const [colorId, setColorId] = useState<string | undefined>(undefined);
  const [sizeId, setSizeId] = useState<string | undefined>(undefined);
  const addItem = useBagStore((s) => s.addItem);

  const color = data.product_colors?.find((c) => c.id === colorId);
  const size = data.product_sizes?.find((s) => s.id === sizeId);
  const isActive = data.is_active !== false && data.is_active !== null; // Default to true if undefined, false if null or false

  // Auto-select first available color/size if present
  useEffect(() => {
    if (!colorId && data.product_colors && data.product_colors.length > 0) {
      setColorId(data.product_colors[0].id);
    }
  }, [data.product_colors, colorId]);

  useEffect(() => {
    if (!sizeId && data.product_sizes && data.product_sizes.length > 0) {
      setSizeId(data.product_sizes[0].id);
    }
  }, [data.product_sizes, sizeId]);

  return (
    <div
      className={`space-y-5 p-5 border rounded-xl bg-card shadow-sm ${
        !isActive ? "opacity-60" : ""
      }`}
    >
      {!isActive && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              Out of Stock
            </span>
          </div>
          <p className="text-xs text-red-600 mt-1">
            This product is currently unavailable for purchase.
          </p>
        </div>
      )}
      <div className="space-y-5">
        {/* Color pills */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Color
          </p>
          <div className="flex flex-wrap gap-2.5">
            {data.product_colors?.map((c) => {
              const selected = colorId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  disabled={!isActive}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition focus:outline-none ${
                    selected
                      ? "bg-primary/10 text-foreground border-primary ring-2 ring-primary/40"
                      : "bg-background hover:bg-accent border-muted"
                  } ${!isActive ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <span
                    className="w-4.5 h-4.5 rounded"
                    style={{ backgroundColor: (c as any).hex_code }}
                  />
                  <span className="text-sm font-medium">{c.name}</span>
                </button>
              );
            })}
            {(!data.product_colors || data.product_colors.length === 0) && (
              <span className="text-xs text-muted-foreground">No colors</span>
            )}
          </div>
        </div>
        {/* Size pills */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Size
          </p>
          <div className="flex flex-wrap gap-2.5">
            {data.product_sizes?.map((s) => {
              const selected = sizeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSizeId(s.id)}
                  disabled={!isActive}
                  aria-pressed={selected}
                  className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition focus:outline-none ${
                    selected
                      ? "bg-primary/10 text-foreground border-primary ring-2 ring-primary/40"
                      : "bg-background hover:bg-accent border-muted"
                  } ${!isActive ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {s.name}
                </button>
              );
            })}
            {(!data.product_sizes || data.product_sizes.length === 0) && (
              <span className="text-xs text-muted-foreground">No sizes</span>
            )}
          </div>
        </div>

        {/* Buy Button Section */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Price per unit</p>
              <p className="text-lg font-semibold text-foreground">
                ₹{data.price_per_unit || "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Quantity</p>
              <p className="text-sm font-medium">1 unit</p>
            </div>
          </div>

          {isActive ? (
            <Button
              className="w-full"
              onClick={() => {
                addItem({
                  productId: data.id,
                  name: data.name,
                  pricePerUnit:
                    typeof data.price_per_unit === "string"
                      ? parseFloat(data.price_per_unit)
                      : data.price_per_unit || 0,
                  quantity: 1,
                  imageUrl: data.product_images?.[0]?.image_url || "",
                  colorId,
                  sizeId,
                  colorName: color?.name,
                  sizeName: size?.name,
                });
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          ) : (
            <Button disabled className="w-full">
              <AlertCircle className="w-4 h-4 mr-2" />
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
