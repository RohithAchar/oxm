"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Supplier navigation grouped by section
const groupedNav: Array<{
  section: string;
  items: { title: string; url: string; matchPrefix?: boolean }[];
}> = [
  {
    section: "Business Overview",
    items: [{ title: "Overview", url: "/supplier/overview" }],
  },
  {
    section: "Product Catalog",
    items: [
      {
        title: "Products",
        url: "/supplier/manage-products",
        matchPrefix: true,
      },
      { title: "Colors", url: "/supplier/colors" },
      { title: "Sizes", url: "/supplier/sizes" },
    ],
  },
  {
    section: "Orders & Leads",
    items: [
      { title: "Orders", url: "/supplier/orders", matchPrefix: true },
      { title: "Buy Lead", url: "/supplier/buylead" },
      { title: "Enquiry", url: "/supplier/enquiry", matchPrefix: true },
    ],
  },
  {
    section: "Trust & Reputation",
    items: [{ title: "Trust Score", url: "/supplier/trust-score" }],
  },
  {
    section: "Business Settings",
    items: [
      { title: "Settings", url: "/supplier/settings", matchPrefix: true },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/supplier/overview">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">OpenXmart</span>
                  <span className="">Latest</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {groupedNav.map((group) => (
              <SidebarMenuItem key={group.section}>
                <SidebarMenuButton asChild>
                  <Link href="#" className="font-medium">
                    {group.section}
                  </Link>
                </SidebarMenuButton>
                {group.items?.length ? (
                  <SidebarMenuSub>
                    {group.items.map((item) => {
                      const active = item.matchPrefix
                        ? pathname?.startsWith(item.url)
                        : pathname === item.url;
                      return (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild isActive={!!active}>
                            <Link href={item.url}>{item.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
