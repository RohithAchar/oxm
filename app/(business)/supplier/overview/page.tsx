"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Star,
  Truck,
  Calendar,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/client";
import {
  PageHeader,
  PrimaryActionButton,
  SecondaryActionButton,
} from "@/components/PageHeader";

// Type definitions based on your schema
type OrderWithDetails = Tables<"sample_orders"> & {
  sample_order_items: Tables<"sample_order_items">[];
  buyer: Tables<"profiles"> | null;
};

type ProductWithDetails = Tables<"products"> & {
  categories: Tables<"categories"> | null;
  sample_order_items: Tables<"sample_order_items">[];
};

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    buyer_name: string | null;
    total_amount: number;
    status:
      | "pending"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled"
      | null;
    created_at: string;
    items: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
    category: string;
  }>;
}

const OverviewPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        // Fetch products count
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select("id, name, categories!category_id(name)")
          .eq("supplier_id", user.id);

        if (productsError) throw productsError;

        // Fetch order items separately to calculate product stats
        const { data: orderItems, error: orderItemsError } = await supabase
          .from("sample_order_items")
          .select("product_id, quantity, price_per_unit, sample_order_id")
          .in("product_id", products?.map((p) => p.id) || []);

        if (orderItemsError) throw orderItemsError;

        // Fetch orders with details
        const { data: orders, error: ordersError } = await supabase
          .from("sample_orders")
          .select(
            `
            *,
            sample_order_items(id, quantity, price_per_unit, product_id),
            buyer:profiles!buyer_id(full_name)
          `
          )
          .eq("supplier_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        // Calculate stats
        const totalProducts = products?.length || 0;
        const totalOrders = orders?.length || 0;
        const totalRevenue =
          orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) ||
          0;

        // Count orders by status
        const pendingOrders =
          orders?.filter((order) => order.status === "pending").length || 0;
        const completedOrders =
          orders?.filter((order) => order.status === "delivered").length || 0;
        const cancelledOrders =
          orders?.filter((order) => order.status === "cancelled").length || 0;

        // Recent orders (last 10)
        const recentOrders =
          orders?.slice(0, 10).map((order) => ({
            id: order.id,
            order_number: order.order_number,
            buyer_name: order.buyer?.full_name || "Unknown",
            total_amount: Number(order.total_amount),
            status: order.status || "pending",
            created_at: order.created_at || new Date().toISOString(),
            items: order.sample_order_items?.length || 0,
          })) || [];

        // Calculate top products
        const productStats = new Map<
          string,
          { name: string; category: string; orders: number; revenue: number }
        >();

        products?.forEach((product) => {
          const productOrderItems =
            orderItems?.filter((item) => item.product_id === product.id) || [];
          const totalOrders = productOrderItems.length;
          const totalRevenue = productOrderItems.reduce(
            (sum: number, item: any) =>
              sum + Number(item.quantity) * Number(item.price_per_unit),
            0
          );

          productStats.set(product.id, {
            name: product.name,
            category: product.categories?.name || "Uncategorized",
            orders: totalOrders,
            revenue: totalRevenue,
          });
        });

        const topProducts = Array.from(productStats.entries())
          .map(([id, stats]) => ({ id, ...stats }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3);

        setStats({
          totalProducts,
          totalOrders,
          totalRevenue,
          pendingOrders,
          completedOrders,
          cancelledOrders,
          recentOrders,
          topProducts,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusVariant = (
    status:
      | "pending"
      | "confirmed"
      | "shipped"
      | "delivered"
      | "cancelled"
      | null
  ) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "shipped":
        return "outline";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color?: string;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{trend}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen rounded-2xl bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div>
                <h3 className="font-medium">Error loading dashboard</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background rounded-2xl pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <PageHeader
            title="Overview"
            description="Welcome back! Here's what's happening with your business."
            actions={
              <>
                <SecondaryActionButton className="w-full md:w-auto">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </SecondaryActionButton>
                <PrimaryActionButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </PrimaryActionButton>
              </>
            }
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            trend="+12% from last month"
            color="blue"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend="+8% from last month"
            color="green"
          />
          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="+15% from last month"
            color="purple"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={Clock}
            color="yellow"
          />
        </div>

        {/* Order Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Order Status
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Delivered</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats.completedOrders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats.pendingOrders}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium">Cancelled</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats.cancelledOrders}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="w-5 h-5 mr-3" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-5 h-5 mr-3" />
                  View All Orders
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ₹{product.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.orders} orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>{order.buyer_name}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell className="font-medium">
                      ₹{order.total_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}

                {stats.recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-4"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
