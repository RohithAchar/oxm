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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

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
  revenueMoMText: string;
  ordersMoMText: string;
  productsAddedText: string;
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
  revenueSeries?: { month: string; revenue: number }[];
}

const OverviewPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    revenueMoMText: "",
    ordersMoMText: "",
    productsAddedText: "",
    recentOrders: [],
    topProducts: [],
    revenueSeries: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<"3M" | "6M" | "12M">("12M");

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
          .select("id, name, created_at, categories!category_id(name)")
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
        // Build revenue series for last 12 months
        const now = new Date();
        const seriesMap = new Map<string, number>();
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          seriesMap.set(key, 0);
        }
        orders?.forEach((o) => {
          if (!o.created_at) return;
          const d = new Date(o.created_at);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
          if (seriesMap.has(key)) {
            seriesMap.set(
              key,
              (seriesMap.get(key) || 0) + Number(o.total_amount)
            );
          }
        });
        const revenueSeries = Array.from(seriesMap.entries()).map(([k, v]) => {
          const [, m] = k.split("-");
          const month = new Date(2000, Number(m) - 1, 1).toLocaleString(
            "en-US",
            {
              month: "short",
            }
          );
          return { month, revenue: v };
        });

        // Month-over-month calculations
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const revenueThisMonth =
          orders
            ?.filter((o) =>
              o.created_at ? new Date(o.created_at) >= startOfThisMonth : false
            )
            .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
        const revenuePrevMonth =
          orders
            ?.filter((o) => {
              if (!o.created_at) return false;
              const d = new Date(o.created_at);
              return d >= startOfPrevMonth && d <= endOfPrevMonth;
            })
            .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;

        const revenueMoMPercent =
          revenuePrevMonth === 0
            ? revenueThisMonth > 0
              ? 100
              : 0
            : Math.round(
                ((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100
              );
        const revenueMoMText = `${
          revenueMoMPercent >= 0 ? "+" : ""
        }${revenueMoMPercent}% from last month`;

        const ordersThisMonth =
          orders?.filter((o) =>
            o.created_at ? new Date(o.created_at) >= startOfThisMonth : false
          ).length || 0;
        const ordersPrevMonth =
          orders?.filter((o) => {
            if (!o.created_at) return false;
            const d = new Date(o.created_at);
            return d >= startOfPrevMonth && d <= endOfPrevMonth;
          }).length || 0;
        const ordersMoMPercent =
          ordersPrevMonth === 0
            ? ordersThisMonth > 0
              ? 100
              : 0
            : Math.round(
                ((ordersThisMonth - ordersPrevMonth) / ordersPrevMonth) * 100
              );
        const ordersMoMText = `${
          ordersMoMPercent >= 0 ? "+" : ""
        }${ordersMoMPercent}% from last month`;

        const productsAddedThisMonth =
          products?.filter((p: any) =>
            p.created_at ? new Date(p.created_at) >= startOfThisMonth : false
          ).length || 0;
        const productsAddedText =
          productsAddedThisMonth > 0
            ? `+${productsAddedThisMonth} added this month`
            : "No new products this month";

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
          revenueMoMText,
          ordersMoMText,
          productsAddedText,
          recentOrders,
          topProducts,
          revenueSeries,
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
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <div className="flex items-center mt-1 md:mt-2">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-500 mr-1" />
                <span className="text-xs md:text-sm text-green-500">
                  {trend}
                </span>
              </div>
            )}
          </div>
          <div className="p-2.5 md:p-3 rounded-full bg-primary/10">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen rounded-2xl bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6">
          {/* Title */}
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-[360px] mt-2" />
          <div className="h-px bg-border mt-6" />

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="hover:shadow-none">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-7 w-20" />
                    </div>
                    <div className="p-3 rounded-full bg-muted">
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Graph card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-44" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[420px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-screen-2xl mx-auto">
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

  // Prepare Y-axis ticks at 5k intervals for the revenue chart
  const revenueMax = Math.max(
    0,
    ...(stats.revenueSeries || []).map((d) => Number(d.revenue) || 0)
  );
  const revenueTop = Math.max(5000, Math.ceil(revenueMax / 5000) * 5000);
  const revenueTicks = Array.from(
    { length: revenueTop / 5000 + 1 },
    (_, i) => i * 5000
  );
  const minTopForVisuals = Math.max(revenueTop, 20000);
  const ticksForVisuals = Array.from(
    { length: minTopForVisuals / 5000 + 1 },
    (_, i) => i * 5000
  );
  const allZeroRevenue = (stats.revenueSeries || []).every(
    (d) => (Number(d.revenue) || 0) === 0
  );
  const rangeMonths = range === "12M" ? 12 : range === "6M" ? 6 : 3;
  const revenueSeriesRanged = (stats.revenueSeries || []).slice(-rangeMonths);

  return (
    <div className="min-h-screen bg-background rounded-2xl pb-24 md:pb-12">
      <div className="max-w-screen-2xl mx-auto px-3 md:px-6">
        {/* Title + Description */}
        <div className="py-4 md:py-6">
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Overview
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="border-t" />

        {/* Top Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-4 md:py-6">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend={stats.revenueMoMText}
            color="purple"
          />
          <StatCard
            title="Sales"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend={stats.ordersMoMText}
            color="green"
          />
          <StatCard
            title="Products in Stock"
            value={stats.totalProducts}
            icon={Package}
            trend={stats.productsAddedText}
            color="blue"
          />
        </div>

        {/* Revenue Graph Section (placeholder) */}
        <Card className="mt-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm md:text-base">
                Revenue per month
              </CardTitle>
              <div className="md:hidden inline-flex rounded-full border p-0.5">
                {(["3M", "6M", "12M"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-2.5 py-1 text-xs rounded-full ${
                      range === r
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }`}
                    aria-pressed={range === r}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pl-2 pr-2 md:pl-4 md:pr-4">
            <div className="relative">
              <ChartContainer
                className="h-[300px] md:h-[440px] w-full"
                config={{
                  revenue: { label: "Revenue", color: "hsl(var(--primary))" },
                }}
              >
                {
                  <>
                    <div className="md:hidden">
                      <BarChart
                        data={revenueSeriesRanged}
                        margin={{ left: 8, right: 8, top: 4, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} strokeOpacity={0.15} />
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis hide domain={[0, minTopForVisuals]} />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              formatter={(val) =>
                                `₹${Number(val).toLocaleString()}`
                              }
                            />
                          }
                        />
                        <Bar
                          dataKey="revenue"
                          fill="var(--color-revenue)"
                          radius={[4, 4, 0, 0]}
                          barSize={
                            range === "3M" ? 28 : range === "6M" ? 18 : 12
                          }
                        />
                      </BarChart>
                    </div>
                    <AreaChart
                      className="hidden md:block"
                      data={stats.revenueSeries}
                      margin={{ left: 44, right: 8, top: 8, bottom: 6 }}
                    >
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.04}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeOpacity={0.2} />
                      <XAxis
                        dataKey="month"
                        interval={2}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        ticks={ticksForVisuals}
                        domain={[0, minTopForVisuals]}
                        tickFormatter={(v) =>
                          `${Math.round(Number(v) / 1000)}k`
                        }
                        width={40}
                      />
                      <ReferenceLine
                        y={0}
                        stroke="hsl(var(--muted-foreground))"
                        strokeOpacity={0.2}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(val) =>
                              `₹${Number(val).toLocaleString()}`
                            }
                          />
                        }
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-revenue)"
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                        dot={{ r: 2, strokeWidth: 0 }}
                        activeDot={{ r: 3 }}
                      />
                    </AreaChart>
                  </>
                }
              </ChartContainer>
              {allZeroRevenue ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs md:text-sm text-muted-foreground">
                  No revenue yet for the past 12 months
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewPage;
