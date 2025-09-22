"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Palette,
  Ruler,
  Package,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Color {
  id: string;
  name: string;
  hex_code: string;
  product_count?: number;
}

interface Size {
  id: string;
  name: string;
  product_count?: number;
}

interface Product {
  id: string;
  name: string;
  colors: Color[];
  sizes: Size[];
}

export default function VariantsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Color management
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("");
  const [editingColor, setEditingColor] = useState<Color | null>(null);

  // Size management
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  // Search
  const [colorSearch, setColorSearch] = useState("");
  const [sizeSearch, setSizeSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [colorsRes, sizesRes] = await Promise.all([
        fetch("/api/colors"),
        fetch("/api/sizes"),
      ]);

      if (colorsRes.ok) {
        const colorsData = await colorsRes.json();
        setColors(colorsData.data || []);
      }

      if (sizesRes.ok) {
        const sizesData = await sizesRes.json();
        setSizes(sizesData.data || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load variants data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateColor = async () => {
    if (!editingColor?.name?.trim() || !editingColor?.hex_code?.trim()) {
      toast.error("Please enter both name and hex code");
      return;
    }

    // Validate hex code format
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexPattern.test(editingColor.hex_code)) {
      toast.error(
        "Please enter a valid hex color code (e.g., #FF0000 or #F00)"
      );
      return;
    }

    try {
      const res = await fetch("/api/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingColor.name.trim(),
          hex: editingColor.hex_code.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setColors([data.data, ...colors]);
        setEditingColor(null);
        toast.success("Color created successfully");
      } else {
        toast.error("Failed to create color");
      }
    } catch (error) {
      toast.error("Failed to create color");
    }
  };

  const handleCreateSize = async () => {
    if (!editingSize?.name?.trim()) {
      toast.error("Please enter a size name");
      return;
    }

    try {
      const res = await fetch("/api/sizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingSize.name.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setSizes([data.data, ...sizes]);
        setEditingSize(null);
        toast.success("Size created successfully");
      } else {
        toast.error("Failed to create size");
      }
    } catch (error) {
      toast.error("Failed to create size");
    }
  };

  const handleDeleteColor = async (colorId: string) => {
    if (!confirm("Are you sure you want to delete this color?")) return;

    try {
      const res = await fetch(`/api/colors/${colorId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setColors(colors.filter((c) => c.id !== colorId));
        toast.success("Color deleted successfully");
      } else {
        toast.error("Failed to delete color");
      }
    } catch (error) {
      toast.error("Failed to delete color");
    }
  };

  const handleDeleteSize = async (sizeId: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;

    try {
      const res = await fetch(`/api/sizes/${sizeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSizes(sizes.filter((s) => s.id !== sizeId));
        toast.success("Size deleted successfully");
      } else {
        toast.error("Failed to delete size");
      }
    } catch (error) {
      toast.error("Failed to delete size");
    }
  };

  const filteredColors = colors.filter(
    (color) =>
      color.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
      color.hex_code.toLowerCase().includes(colorSearch.toLowerCase())
  );

  const filteredSizes = sizes.filter((size) =>
    size.name.toLowerCase().includes(sizeSearch.toLowerCase())
  );

  if (loading) {
    return (
      <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
        <div className="pt-2 md:pt-4">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Variants
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your product colors, sizes, and variants.
          </p>
        </div>
        <div className="border-t" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Variants
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage your product colors, sizes, and variants. To assign variants to
          specific products, go to{" "}
          <Link
            href="/supplier/manage-products"
            className="text-primary hover:underline"
          >
            Manage Products
          </Link>{" "}
          and click "Manage Variants" for each product.
        </p>
      </div>
      <div className="border-t" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total Colors
                </p>
                <p className="text-xl md:text-2xl font-bold mt-1">
                  {colors.length}
                </p>
              </div>
              <div className="p-2.5 md:p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Palette className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Total Sizes
                </p>
                <p className="text-xl md:text-2xl font-bold mt-1">
                  {sizes.length}
                </p>
              </div>
              <div className="p-2.5 md:p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <Ruler className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Color Management</CardTitle>
                <Button
                  onClick={() =>
                    setEditingColor({ id: "", name: "", hex_code: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add/Edit Color Form */}
              {editingColor && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-4">
                    {editingColor.id ? "Edit Color" : "Add New Color"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color-name">Color Name</Label>
                      <Input
                        id="color-name"
                        value={editingColor.name}
                        onChange={(e) =>
                          setEditingColor({
                            ...editingColor,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Royal Blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color-hex">Color</Label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            id="color-hex"
                            value={editingColor.hex_code || "#000000"}
                            onChange={(e) =>
                              setEditingColor({
                                ...editingColor,
                                hex_code: e.target.value,
                              })
                            }
                            className="w-16 h-10 p-1 border rounded cursor-pointer"
                          />
                          <Input
                            value={editingColor.hex_code}
                            onChange={(e) => {
                              let value = e.target.value;
                              // Auto-add # if user doesn't include it
                              if (value && !value.startsWith("#")) {
                                value = "#" + value;
                              }
                              setEditingColor({
                                ...editingColor,
                                hex_code: value,
                              });
                            }}
                            placeholder="#1e40af"
                            className="flex-1"
                          />
                          {editingColor.hex_code && (
                            <div
                              className="w-10 h-10 border rounded"
                              style={{ backgroundColor: editingColor.hex_code }}
                              title={editingColor.hex_code}
                            />
                          )}
                        </div>
                        {/* Quick color presets */}
                        <div className="flex gap-1 flex-wrap">
                          {[
                            "#1e40af", // Blue-700
                            "#dc2626", // Red-600
                            "#059669", // Emerald-600
                            "#7c3aed", // Violet-600
                            "#ea580c", // Orange-600
                            "#be185d", // Pink-700
                            "#0891b2", // Cyan-600
                            "#65a30d", // Lime-600
                            "#ca8a04", // Yellow-600
                            "#9333ea", // Purple-600
                            "#e11d48", // Rose-600
                            "#0f172a", // Slate-900
                            "#f59e0b", // Amber-500
                            "#8b5cf6", // Violet-500
                            "#06b6d4", // Cyan-500
                            "#84cc16", // Lime-500
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                              style={{ backgroundColor: preset }}
                              onClick={() =>
                                setEditingColor({
                                  ...editingColor,
                                  hex_code: preset,
                                })
                              }
                              title={preset}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      onClick={handleCreateColor}
                      disabled={!editingColor.name || !editingColor.hex_code}
                    >
                      {editingColor.id ? "Update" : "Add"} Color
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingColor(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search colors..."
                  value={colorSearch}
                  onChange={(e) => setColorSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Colors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredColors.map((color) => (
                  <div
                    key={color.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color.hex_code }}
                        />
                        <div>
                          <p className="font-medium">{color.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {color.hex_code}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingColor(color)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteColor(color.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {color.product_count !== undefined && (
                      <Badge variant="secondary" className="text-xs">
                        {color.product_count} products
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              {filteredColors.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No colors found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sizes Tab */}
        <TabsContent value="sizes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Size Management</CardTitle>
                <Button onClick={() => setEditingSize({ id: "", name: "" })}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Size
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add/Edit Size Form */}
              {editingSize && (
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-4">
                    {editingSize.id ? "Edit Size" : "Add New Size"}
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="size-name">Size Name</Label>
                      <Input
                        id="size-name"
                        value={editingSize.name}
                        onChange={(e) =>
                          setEditingSize({
                            ...editingSize,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Large, XL, 42"
                      />
                    </div>

                    {/* Quick size presets */}
                    <div className="space-y-2">
                      <Label>Quick Add Common Sizes</Label>
                      <div className="flex gap-1 flex-wrap">
                        {[
                          "XS",
                          "S",
                          "M",
                          "L",
                          "XL",
                          "XXL",
                          "XXXL",
                          "28",
                          "30",
                          "32",
                          "34",
                          "36",
                          "38",
                          "40",
                          "42",
                          "44",
                          "46",
                          "48",
                          "Small",
                          "Medium",
                          "Large",
                          "Extra Large",
                          "One Size",
                          "Free Size",
                          "Universal",
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
                            onClick={() =>
                              setEditingSize({
                                ...editingSize,
                                name: preset,
                              })
                            }
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        onClick={handleCreateSize}
                        disabled={!editingSize.name}
                      >
                        {editingSize.id ? "Update" : "Add"} Size
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingSize(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search sizes..."
                  value={sizeSearch}
                  onChange={(e) => setSizeSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sizes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSizes.map((size) => (
                  <div
                    key={size.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{size.name}</p>
                        {size.product_count !== undefined && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {size.product_count} products
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSize(size)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSize(size.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSizes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Ruler className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sizes found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
