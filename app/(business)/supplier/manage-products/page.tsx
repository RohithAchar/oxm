"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
} from "lucide-react";

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
import { Database } from "@/utils/supabase/database.types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

const ManageProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categroies, setCategories] = useState<Category[]>([]);

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
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.is_active) ||
      (statusFilter === "inactive" && !product.is_active);

    const matchesCategory =
      categoryFilter === "all" || product.category_id === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleToggleStatus = (productId: string) => {
    // Implementation for toggling product status
    console.log("Toggle status for product:", productId);
  };

  const handleEditProduct = (productId: string) => {
    // Implementation for editing product
    console.log("Edit product:", productId);
  };

  const handleDeleteProduct = (productId: string) => {
    // Implementation for deleting product
    console.log("Delete product:", productId);
  };

  const handleViewProduct = (productId: string) => {
    // Implementation for viewing product details
    console.log("View product:", productId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        {/* <Button className="md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {products.filter((p) => p.is_active).length}
                </div>
                <p className="text-xs text-muted-foreground">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sample Available
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {products.filter((p) => p.is_sample_available).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready for sampling
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Sample Price
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <CardSkeleton />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  $
                  {Math.round(
                    products.reduce((acc, p) => acc + p.sample_price, 0) /
                      products.length
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average across all products
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Search, filter, and manage your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, SKU, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
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
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sample</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <SkeletonProducts />
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{product.name}</div>
                        {/* <div className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </div> */}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell className="capitalize">
                      {
                        categroies.find(
                          (category) => category.id === product.category_id
                        )?.name
                      }
                    </TableCell>
                    <TableCell>${product.sample_price}</TableCell>
                    <TableCell>{product.minimum_order_quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.is_active ? "default" : "secondary"}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.is_sample_available ? "outline" : "secondary"
                        }
                      >
                        {product.is_sample_available
                          ? "Available"
                          : "Not Available"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewProduct(product.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(product.id)}
                          >
                            {product.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
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
        <Skeleton className="h-4 w-16" />
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
