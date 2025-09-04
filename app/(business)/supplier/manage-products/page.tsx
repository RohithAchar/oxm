"use client";

import { useEffect, useState } from "react";
import { Search, MoreHorizontal, Edit, Eye, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

const ManageProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categroies, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const result = response.data.result.data;
        setProducts(result);

        const categoriesResponse = await axios.get("/api/categories");
        const categories = categoriesResponse.data.categories;
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
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    const matchesCategory =
      categoryFilter === "all" || product.category_id === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleToggleStatus = async (productId: string, product: Product) => {
    try {
      setLoading(true);
      await axios.patch(`/api/products/${productId}`, {
        is_active: !product.is_active,
      });

      toast.success("Product status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error toggling product status:", error);
      toast.error("Error toggling product status");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/supplier/manage-products/${productId}?mode=edit`);
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/supplier/manage-products/${productId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pb-24 md:pb-2 space-y-6 lg:my-4">
      {/* Header */}
      <PageHeader
        title="Manage Products"
        description="Manage your product catalog, inventory, and pricing"
      />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="text-3xl font-semibold text-foreground">
                  {products.length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  +2 from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Products
            </CardTitle>
            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="text-3xl font-semibold text-foreground">
                  {products.filter((p) => p.is_active).length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round(
                    (products.filter((p) => p.is_active).length /
                      products.length) *
                      100
                  )}
                  % of total
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-6 px-6">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sample Available
            </CardTitle>
            <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="text-3xl font-semibold text-foreground">
                  {products.filter((p) => p.is_sample_available).length}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Ready for sampling
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border shadow-sm rounded-xl overflow-hidden">
        <CardHeader className="px-8 pt-8 pb-4">
          <CardTitle className="text-2xl font-semibold text-foreground">
            Product Catalog
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base mt-2">
            Search, filter, and manage your products
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-3 bg-muted rounded-xl px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] border-border rounded-xl bg-background hover:bg-muted/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] border-border rounded-xl bg-background hover:bg-muted/50">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="all">All</SelectItem>
                  {categroies.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="bg-card border shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-0">
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
                            onClick={() => handleViewProduct(product.id)}
                            className="rounded-lg hover:bg-muted"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
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
