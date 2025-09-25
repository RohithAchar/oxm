"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar as UISidebar,
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

const groupedNav: Array<{
  section: string;
  items: { title: string; url: string; matchPrefix?: boolean }[];
}> = [
  {
    section: "Platform management",
    items: [
      { title: "Banner", url: "/admin/banner" },
      { title: "Notifications", url: "/admin/notifications" },
      {
        title: "Support Tickets",
        url: "/admin/support-tickets",
        matchPrefix: true,
      },
    ],
  },
  {
    section: "Verification",
    items: [{ title: "Business verification", url: "/admin/verify-business" }],
  },
  {
    section: "Account",
    items: [{ title: "Profile", url: "/supplier/view-profile" }],
  },
];

export function AdminSidebar({
  name,
}: {
  profileUrl: string;
  name: string;
  username: string;
  email: string;
  userProfileUrl: string;
}) {
  const pathname = usePathname();
  return (
    <UISidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">OpenXmart</span>
                  <span className="">Admin</span>
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
    </UISidebar>
  );
}
