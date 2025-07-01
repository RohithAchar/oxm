"use client";

import { useState } from "react";
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

// Mock data based on the schema
const mockProducts = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    sku: "WH-001",
    brand: "AudioTech",
    category_id: "electronics",
    supplier_id: "sup-001",
    sample_price: 299.99,
    minimum_order_quantity: 10,
    is_active: true,
    is_sample_available: true,
    country_of_origin: "Germany",
    hsn_code: "85183000",
    height: 20,
    breadth: 15,
    length: 25,
    weight: 0.5,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring",
    sku: "FT-002",
    brand: "FitLife",
    category_id: "wearables",
    supplier_id: "sup-002",
    sample_price: 149.99,
    minimum_order_quantity: 25,
    is_active: true,
    is_sample_available: false,
    country_of_origin: "China",
    hsn_code: "91021100",
    height: 1,
    breadth: 4,
    length: 25,
    weight: 0.03,
    created_at: "2024-01-10T08:15:00Z",
    updated_at: "2024-01-18T16:20:00Z",
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Sustainable organic cotton t-shirt in multiple colors",
    sku: "TS-003",
    brand: "EcoWear",
    category_id: "clothing",
    supplier_id: "sup-003",
    sample_price: 29.99,
    minimum_order_quantity: 50,
    is_active: false,
    is_sample_available: true,
    country_of_origin: "India",
    hsn_code: "61091000",
    height: 0.5,
    breadth: 40,
    length: 60,
    weight: 0.15,
    created_at: "2024-01-05T12:00:00Z",
    updated_at: "2024-01-22T09:30:00Z",
  },
  {
    id: "4",
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle, 750ml capacity",
    sku: "WB-004",
    brand: "HydroMax",
    category_id: "accessories",
    supplier_id: "sup-001",
    sample_price: 39.99,
    minimum_order_quantity: 30,
    is_active: true,
    is_sample_available: true,
    country_of_origin: "USA",
    hsn_code: "73239300",
    height: 25,
    breadth: 7,
    length: 7,
    weight: 0.4,
    created_at: "2024-01-12T15:45:00Z",
    updated_at: "2024-01-19T11:10:00Z",
  },
];

const ManageProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = mockProducts.filter((product) => {
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
        <Button className="md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
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
            <div className="text-2xl font-bold">{mockProducts.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
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
            <div className="text-2xl font-bold">
              {mockProducts.filter((p) => p.is_active).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (mockProducts.filter((p) => p.is_active).length /
                  mockProducts.length) *
                  100
              )}
              % of total
            </p>
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
            <div className="text-2xl font-bold">
              {mockProducts.filter((p) => p.is_sample_available).length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for sampling</p>
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
            <div className="text-2xl font-bold">
              $
              {Math.round(
                mockProducts.reduce((acc, p) => acc + p.sample_price, 0) /
                  mockProducts.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all products
            </p>
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
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="wearables">Wearables</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
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
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {product.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="capitalize">
                    {product.category_id?.replace("_", " ")}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {mockProducts.length} products
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
