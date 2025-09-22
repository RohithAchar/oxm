"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Palette,
  Ruler,
  Package,
  Search,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Color {
  id: string;
  name: string;
  hex_code: string;
}

interface Size {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  colors: Color[];
  sizes: Size[];
}

export default function ProductVariantsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [allColors, setAllColors] = useState<Color[]>([]);
  const [allSizes, setAllSizes] = useState<Size[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Search states
  const [colorSearch, setColorSearch] = useState("");
  const [sizeSearch, setSizeSearch] = useState("");

  useEffect(() => {
    if (productId) {
      loadData();
    }
  }, [productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productRes, attributesRes, colorsRes, sizesRes] =
        await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/products/${productId}/attributes`),
          fetch("/api/colors"),
          fetch("/api/sizes"),
        ]);

      if (productRes.ok) {
        const productData = await productRes.json();
        setProduct(productData.data);
      }

      if (attributesRes.ok) {
        const attributesData = await attributesRes.json();
        setSelectedColorIds(
          attributesData.data.colors?.map((c: Color) => c.id) || []
        );
        setSelectedSizeIds(
          attributesData.data.sizes?.map((s: Size) => s.id) || []
        );
      }

      if (colorsRes.ok) {
        const colorsData = await colorsRes.json();
        setAllColors(colorsData.data || []);
      }

      if (sizesRes.ok) {
        const sizesData = await sizesRes.json();
        setAllSizes(sizesData.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load product variants data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVariants = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/products/${productId}/attributes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colorIds: selectedColorIds,
          sizeIds: selectedSizeIds,
        }),
      });

      if (res.ok) {
        toast.success("Product variants updated successfully");
        // Update local state
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                colors: allColors.filter((c) =>
                  selectedColorIds.includes(c.id)
                ),
                sizes: allSizes.filter((s) => selectedSizeIds.includes(s.id)),
              }
            : null
        );
      } else {
        toast.error("Failed to update product variants");
      }
    } catch (error) {
      toast.error("Failed to update product variants");
    } finally {
      setSaving(false);
    }
  };

  const toggleColor = (colorId: string) => {
    setSelectedColorIds((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  const toggleSize = (sizeId: string) => {
    setSelectedSizeIds((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const filteredColors = allColors.filter(
    (color) =>
      color.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
      color.hex_code.toLowerCase().includes(colorSearch.toLowerCase())
  );

  const filteredSizes = allSizes.filter((size) =>
    size.name.toLowerCase().includes(sizeSearch.toLowerCase())
  );

  if (loading) {
    return (
      <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
        <div className="pt-2 md:pt-4">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="border-t" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
        <div className="pt-2 md:pt-4">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Product Not Found
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            The product you're looking for doesn't exist.
          </p>
        </div>
        <div className="border-t" />
        <Button onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </main>
    );
  }

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Manage Variants
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {product.name}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t" />

      {/* Current Variants Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Current Variants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Colors ({selectedColorIds.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedColorIds.map((colorId) => {
                  const color = allColors.find((c) => c.id === colorId);
                  return color ? (
                    <div
                      key={colorId}
                      className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full"
                    >
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color.hex_code }}
                      />
                      <span className="text-sm">{color.name}</span>
                    </div>
                  ) : null;
                })}
                {selectedColorIds.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No colors selected
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Sizes ({selectedSizeIds.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSizeIds.map((sizeId) => {
                  const size = allSizes.find((s) => s.id === sizeId);
                  return size ? (
                    <Badge key={sizeId} variant="outline" className="text-sm">
                      {size.name}
                    </Badge>
                  ) : null;
                })}
                {selectedSizeIds.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No sizes selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variant Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colors Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Select Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Colors</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search colors..."
                  value={colorSearch}
                  onChange={(e) => setColorSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredColors.map((color) => (
                <div
                  key={color.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                >
                  <Checkbox
                    id={`color-${color.id}`}
                    checked={selectedColorIds.includes(color.id)}
                    onCheckedChange={() => toggleColor(color.id)}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color.hex_code }}
                    />
                    <div>
                      <Label
                        htmlFor={`color-${color.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {color.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {color.hex_code}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredColors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No colors found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sizes Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Select Sizes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Search Sizes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search sizes..."
                  value={sizeSearch}
                  onChange={(e) => setSizeSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredSizes.map((size) => (
                <div
                  key={size.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                >
                  <Checkbox
                    id={`size-${size.id}`}
                    checked={selectedSizeIds.includes(size.id)}
                    onCheckedChange={() => toggleSize(size.id)}
                  />
                  <Label
                    htmlFor={`size-${size.id}`}
                    className="font-medium cursor-pointer flex-1"
                  >
                    {size.name}
                  </Label>
                </div>
              ))}
              {filteredSizes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Ruler className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sizes found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={saving}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSaveVariants} disabled={saving}>
          <Check className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Variants"}
        </Button>
      </div>
    </main>
  );
}
