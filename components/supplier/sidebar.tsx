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

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const sidebarItems = [
  { name: "Profile", href: "/supplier/view-profile", icon: UserCircle },
  { name: "Add New Product", href: "/supplier/add-product", icon: CirclePlus },
  { name: "Products", href: "/supplier/manage-products", icon: Boxes },
  { name: "Orders", href: "/supplier/orders", icon: ClipboardList },
  { name: "Dashboard", href: "/supplier/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/supplier/users", icon: Users },
  { name: "Settings", href: "/supplier/settings", icon: Settings },
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

  console.log("userProfileUrl:", userProfileUrl);

  return (
    <div className="h-screen w-64 bg-gray-50/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              {profileUrl ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img
                    src={profileUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gray-300 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    {/* default icon */}
                  </svg>
                </div>
              )}
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-gray-100/60",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  )}
                />
                <span className="truncate">{name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </Link>
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
  );
}
