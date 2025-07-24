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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const sidebarItems = [
  { name: "Profile", href: "/supplier/view-profile", icon: UserCircle },
  { name: "Overview", href: "/supplier/overview", icon: BarChart3 },
  { name: "Add New Product", href: "/supplier/add-product", icon: CirclePlus },
  { name: "Products", href: "/supplier/manage-products", icon: Boxes },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navigation */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
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
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h1>
          </div>

          {/* <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button> */}
        </div>

        {/* Mobile Tab Navigation */}
        <div className="overflow-x-auto">
          <div className="flex space-x-1 px-4 pb-3 min-w-max">
            {sidebarItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </Link>
              );
            })}
            {sidebarItems.length > 6 && (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 whitespace-nowrap"
              >
                <Menu className="h-4 w-4" />
                <span>More</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex rounded-lg h-screen w-64 bg-gray-50/80 backdrop-blur-xl border-r border flex-col my-4 ml-4">
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
    </>
  );
}
