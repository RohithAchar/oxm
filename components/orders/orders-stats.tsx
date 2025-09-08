import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

interface OrdersStatsProps {
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  };
}

export function OrdersStats({ stats }: OrdersStatsProps) {
  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Shipped",
      value: stats.shipped,
      icon: Truck,
      color: "bg-purple-500",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: Package,
      color: "bg-emerald-500",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof stat.value === "number" ? stat.value : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
