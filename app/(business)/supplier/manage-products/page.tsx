"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal, Edit, Eye, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { PageHeader } from "@/components/PageHeader";
import { Database } from "@/utils/supabase/database.types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Color = { id: string; name: string };
type Size = { id: string; name: string };

const ManageProductsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categroies, setCategories] = useState<Category[]>([]);
  const [colorsMap, setColorsMap] = useState<Record<string, string>>({});
  const [sizesMap, setSizesMap] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeProductForActions, setActiveProductForActions] =
    useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const result = response.data.result.data;
        setProducts(result);

        const categoriesResponse = await axios.get("/api/categories");
        const categories = categoriesResponse.data.categories;
        // Fetch color/size names per id to avoid large payloads
        const uniqueColorIds = new Set<string>();
        const uniqueSizeIds = new Set<string>();
        (result as any[]).forEach((p: any) => {
          if (Array.isArray(p.color_ids))
            p.color_ids.forEach((id: string) => uniqueColorIds.add(id));
          if (Array.isArray(p.size_ids))
            p.size_ids.forEach((id: string) => uniqueSizeIds.add(id));
        });

        const [colorPairs, sizePairs] = await Promise.all([
          Promise.all(
            Array.from(uniqueColorIds).map(async (id) => {
              try {
                const res = await axios.get(`/api/colors/${id}`);
                const data = res.data?.data || res.data || {};
                return [id, data.name as string];
              } catch {
                return [id, undefined];
              }
            })
          ),
          Promise.all(
            Array.from(uniqueSizeIds).map(async (id) => {
              try {
                const res = await axios.get(`/api/sizes/${id}`);
                const data = res.data?.data || res.data || {};
                return [id, data.name as string];
              } catch {
                return [id, undefined];
              }
            })
          ),
        ]);

        setColorsMap(
          Object.fromEntries(
            colorPairs.filter(([, v]) => Boolean(v)) as [string, string][]
          )
        );
        setSizesMap(
          Object.fromEntries(
            sizePairs.filter(([, v]) => Boolean(v)) as [string, string][]
          )
        );
        const mainCategories = categories.filter(
          (category: Category) => category.parent_id === null
        );
        setCategories(mainCategories);
      } catch (error: any) {
        console.error("Frontend API Error:", error);

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const message =
            error.response?.data?.message || "Unknown error occurred";

          switch (status) {
            case 400:
              toast.error("Bad Request: " + message);
              break;
            case 401:
              toast.error("Unauthorized: " + message);
              // Optionally redirect to login
              break;
            case 503:
              toast.error("Service Unavailable: " + message);
              break;
            case 500:
              toast.error("Server Error: " + message);
              break;
            default:
              toast.error("Error: " + message);
          }
        } else {
          // Non-Axios errors
          toast.error("Unexpected error: " + error.message || error.toString());
        }
      } finally {
        setLoading(false); // <- stop loading after fetch
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    const matchesCategory =
      categoryFilter === "all" || product.category_id === categoryFilter;

    return matchesStatus && matchesCategory;
  });

  const handleToggleStatus = async (productId: string, product: Product) => {
    try {
      // Optimistic toggle
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_active: !product.is_active } : p
        )
      );

      await axios.patch(`/api/products/${productId}`, {
        is_active: !product.is_active,
      });

      toast.success("Product status updated successfully");
    } catch (error) {
      console.error("Error toggling product status:", error);
      // Revert optimistic update on error
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, is_active: product.is_active } : p
        )
      );
      toast.error("Error toggling product status");
    } finally {
      // no-op
    }
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/supplier/manage-products/${productId}?mode=edit`);
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/supplier/manage-products/${productId}`);
  };

  return (
    <div className="max-w-screen-2xl mx-auto pb-20 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 md:pt-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="text-muted-foreground mt-1">
            List and manage all your products.
          </p>
        </div>
        <Button
          className="inline-flex bg-foreground text-background cursor-pointer h-8 px-3 hover:bg-foreground hover:opacity-90"
          asChild
        >
          <Link href="/supplier/add-product">Add Product</Link>
        </Button>
      </div>
      <div className="border-t" />

      {/* Products Table / Mobile List */}
      <Card className="bg-card border shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {/* Mobile list */}
          <div className="md:hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-[13px] font-medium text-muted-foreground">
                Product
              </span>
            </div>
            {loading ? (
              <div className="divide-y">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="w-full flex items-center justify-between px-4 py-3 active:opacity-90"
                    onClick={() => {
                      setActiveProductForActions(product);
                      setDrawerOpen(true);
                    }}
                  >
                    <div className="min-w-0 text-left">
                      <p className="text-sm text-foreground truncate">
                        {product.name}
                      </p>
                    </div>
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.is_active
                          ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </button>
                ))}
                {/* Drawer lives outside list for single parent JSX */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Product actions</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4 grid gap-2">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          if (!activeProductForActions) return;
                          router.push(
                            `/supplier/manage-products/${activeProductForActions.id}?mode=edit`
                          );
                          setDrawerOpen(false);
                        }}
                      >
                        Edit product
                      </Button>
                      <Button
                        className="justify-start"
                        onClick={() => {
                          if (!activeProductForActions) return;
                          handleToggleStatus(
                            activeProductForActions.id,
                            activeProductForActions
                          );
                          setDrawerOpen(false);
                        }}
                      >
                        {activeProductForActions?.is_active
                          ? "Deactivate"
                          : "Activate"}
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="ghost" className="justify-start">
                          Close
                        </Button>
                      </DrawerClose>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/30">
                  <TableHead className="text-muted-foreground font-medium py-4 px-6">
                    Product
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium py-4 px-6">
                    Brand
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium py-4 px-6">
                    Category
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium py-4 px-6">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground font-medium py-4 px-6">
                    Sample
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium py-4 px-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <SkeletonProducts />
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">
                            {product.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground">
                        {product.brand}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-muted-foreground capitalize">
                        {
                          categroies.find(
                            (category) => category.id === product.category_id
                          )?.name
                        }
                      </TableCell>

                      <TableCell className="py-4 px-6">
                        <Badge
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.is_active
                              ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.is_sample_available
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200"
                          }`}
                        >
                          {product.is_sample_available
                            ? "Available"
                            : "Not Available"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-full hover:bg-muted"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="rounded-xl border-border shadow-lg"
                          >
                            <DropdownMenuLabel className="text-muted-foreground font-medium">
                              Actions
                            </DropdownMenuLabel>

                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product.id)}
                              className="rounded-lg hover:bg-muted"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem
                              className="text-destructive hover:bg-destructive/10 rounded-lg"
                              onClick={() =>
                                handleToggleStatus(product.id, product)
                              }
                            >
                              {product.is_active ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-card rounded-xl p-6 shadow-sm border">
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="rounded-full border-border hover:bg-muted"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="rounded-full border-border hover:bg-muted"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageProductsPage;

const SkeletonProducts = () => {
  return [...Array(5)].map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-10" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 rounded-full" />
      </TableCell>
    </TableRow>
  ));
};

const CardSkeleton = () => {
  return (
    <>
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-24 mt-2" />
    </>
  );
};
