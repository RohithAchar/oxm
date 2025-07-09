// components/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShoppingBag,
  Box,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
  { name: "View Profile", href: "/supplier/view-profile", icon: ShoppingBag },
  { name: "Add Product", href: "/supplier/add-product", icon: ShoppingBag },
  { name: "Manage Products", href: "/supplier/manage-products", icon: Box },
  { name: "Dashboard", href: "/supplier/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/supplier/users", icon: Users },
  { name: "Settings", href: "/supplier/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 border-r bg-background text-foreground">
      <div className="p-6 text-2xl font-bold">My App</div>
      <Separator />
      <ScrollArea className="h-[calc(100%-80px)]">
        <nav className="space-y-1 px-4 py-4">
          {sidebarItems.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition",
                pathname === href && "bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
