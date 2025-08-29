// components/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  UserCircle,
  CirclePlus,
  Boxes,
  ClipboardList,
  BarChart3,
  MessageCircle,
  Shield,
  Flag,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const sidebarItems = [
  { name: "Profile", href: "/supplier/profile", icon: UserCircle },
  { name: "Overview", href: "/supplier/overview", icon: BarChart3 },
  { name: "Add New Product", href: "/supplier/add-product", icon: CirclePlus },
  { name: "Products", href: "/supplier/manage-products", icon: Boxes },
  { name: "Colors", href: "/supplier/colors", icon: CirclePlus },
  { name: "Sizes", href: "/supplier/sizes", icon: CirclePlus },
  { name: "Orders", href: "/supplier/orders", icon: ClipboardList },
  { name: "Enquiry", href: "/supplier/enquiry", icon: MessageCircle },
  { name: "Trust Score", href: "/supplier/trust-score", icon: Shield },
  { name: "Tips", href: "/supplier/tips", icon: CirclePlus },
  { name: "Notice", href: "/supplier/notice", icon: Flag },
];

export function Sidebar({
  profileUrl,
  name,
  username,
  email,
  userProfileUrl,
}: {
  profileUrl: string;
  name: string;
  username: string;
  email: string;
  userProfileUrl: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="lg:hidden bg-background border-b sticky top-0 z-50">
        {/* Mobile Tab Navigation */}
        <div className="overflow-x-auto">
          <div className="flex space-x-1 px-4 pb-4 min-w-max">
            {sidebarItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 whitespace-nowrap border",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex rounded-2xl h-screen w-64 backdrop-blur-xl border flex-col ml-4">
        {/* Header */}
        <div className="px-6 py-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="border">
              <AvatarImage
                src={profileUrl || "/placeholder-profile.png"}
                alt="Profile"
              />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <h1 className="text-xl font-semibold text-foreground">{name}</h1>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {sidebarItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Button
                  key={name}
                  variant={"link"}
                  asChild
                  className={cn(
                    "w-full flex items-center justify-start font-semibold text-muted-foreground",
                    isActive && "text-primary"
                  )}
                >
                  <Link href={href}>
                    <Icon className="h-4 w-4" />
                    <span className={cn("truncate", isActive && "underline")}>
                      {name}
                    </span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-200/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar>
              <AvatarImage src={userProfileUrl} alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {username}
              </p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
