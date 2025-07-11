// components/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCircle,
  CirclePlus,
  Boxes,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const sidebarItems = [
  { name: "Profile", href: "/supplier/view-profile", icon: UserCircle }, // Simpler and cleaner than "View Profile"
  { name: "Add New Product", href: "/supplier/add-product", icon: CirclePlus }, // More clear than "Add Product"
  { name: "Products", href: "/supplier/manage-products", icon: Boxes }, // Short, clean, and intuitive
  { name: "Orders", href: "/supplier/orders", icon: ClipboardList }, // Straightforward and easy to scan
  { name: "Dashboard", href: "/supplier/dashboard", icon: LayoutDashboard }, // Already good
  { name: "User Management", href: "/supplier/users", icon: Users }, // Better context than just "Users"
  { name: "Settings", href: "/supplier/settings", icon: Settings }, // Already good
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Card className="h-screen w-64 rounded-xl border-r">
      <CardContent className="p-0">
        <div className="p-6 text-2xl font-bold">My App</div>
        <Separator />
        <ScrollArea className="h-[calc(100%-80px)]">
          <nav className="space-y-1 px-4 py-4">
            {sidebarItems.map(({ name, href, icon: Icon }) => (
              <Button
                key={name}
                variant={pathname === href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sm font-medium",
                  pathname === href && "bg-secondary text-secondary-foreground"
                )}
                asChild
              >
                <Link href={href}>
                  <Icon className="h-4 w-4" />
                  {name}
                </Link>
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
