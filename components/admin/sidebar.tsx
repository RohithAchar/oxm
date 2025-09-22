"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Bell, BookImage, UserCircle, Building2 } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const sidebarItems = [
  { name: "Banner", href: "/admin/banner", icon: BookImage },
  {
    name: "Business Verification",
    href: "/admin/verify-business",
    icon: Building2,
  },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Profile", href: "/supplier/view-profile", icon: UserCircle },
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
      {/* Mobile Top Tabs */}
      <div className="flex md:hidden sticky top-0 z-30 border-b bg-background">
        {sidebarItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={name}
              href={href}
              className={cn(
                "flex-1 text-center py-3 text-sm font-medium border-b-2",
                isActive
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5" />
                {name}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col bg-muted/40 backdrop-blur-xl border-r border rounded-lg md:ml-8 md:mt-8">
        {/* Header */}
        <div className="px-6 py-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-8 h-8 bg-muted flex items-center justify-center rounded-lg">
                  <svg
                    className="w-5 h-5 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    {/* default icon */}
                  </svg>
                </div>
              )}
            </div>
            <h1 className="text-xl font-semibold text-foreground">{name}</h1>
          </div>
        </div>

        {/* Scrollable middle section */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {sidebarItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={name}
                  href={href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <span className="truncate">{name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer pinned to bottom */}
        <div className="px-3 py-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar>
              <AvatarImage src={userProfileUrl} alt="Profile" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {username}
              </p>
              <p className="text-xs text-muted-foreground truncate">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
