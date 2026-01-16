"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductSearch from "@/components/search/ProductSearch";
import EnhancedProductSearch from "@/components/search/EnhancedProductSearch";
import SimpleEnhancedSearch from "@/components/search/SimpleEnhancedSearch";
import {
  MessageSquare,
  User,
  Package,
  FolderTree,
  Store,
  Bell,
  LogIn,
  LogOut,
} from "lucide-react";
import { ModeToggle } from "./theme-toggle-button";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavigationMenuHome } from "../home/navigation-menu";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const showThemeToggle = true;
  const showSearch = !(pathname?.startsWith("/supplier") ?? false);
  const isSupplier = pathname?.startsWith("/supplier");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const supplierNav = [
    { name: "Overview", href: "/supplier/overview" },
    { name: "Colors", href: "/supplier/colors" },
    { name: "Sizes", href: "/supplier/sizes" },
    { name: "Products", href: "/supplier/manage-products" },
    { name: "Orders", href: "/supplier/orders" },
    { name: "Buy Lead", href: "/supplier/buylead" },
    { name: "Enquiry", href: "/supplier/enquiry" },
    { name: "Trust Score", href: "/supplier/trust-score" },
    { name: "Settings", href: "/supplier/settings" },
  ];
  return (
    <>
      {/* Desktop Topbar */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div
          className={`${
            isSupplier ? "hidden max-w-full" : "max-w-7xl"
          } mx-auto px-4 h-14 grid grid-cols-[auto_1fr_auto] items-center`}
        >
          <Link href="/" className="font-semibold text-xl mr-4 md:mr-5 lg:mr-6">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
          </Link>
          <div className="hidden md:block justify-self-center w-full">
            {isSupplier ? (
              <nav className="flex items-center justify-center gap-2">
                {/* {supplierNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })} */}
              </nav>
            ) : showSearch ? (
              // <SimpleEnhancedSearch
              //   placeholder="Search products"
              //   size="sm"
              //   rounded="full"
              //   className="w-full max-w-xl mx-auto"
              //   buttonMode="icon"
              //   showSuggestions={true}
              //   maxSuggestions={6}
              // />
              <></>
            ) : null}
          </div>
          <div className="ml-3 md:ml-4 flex items-center gap-2 sm:gap-3">
            {showThemeToggle && <ModeToggle />}
            {/* Keep visual consistency: icons use same muted/hover states as ModeToggle */}
            <Link href="/messages">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 scale-100" />
                <span className="sr-only">Messages</span>
              </Button>
            </Link>
            <Link href="/account">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <User className="h-4 w-4 scale-100" />
                <span className="sr-only">User</span>
              </Button>
            </Link>
          </div>
        </div>
        {pathname === "/" && (
          <div className="max-w-7xl mx-auto pb-2">
            <NavigationMenuHome />
          </div>
        )}
      </header>

      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-3 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg leading-none">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
          </Link>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent
              className="!z-[9999] bg-muted"
              overlayClassName="!z-[9998]"
            >
              <div className="p-4 space-y-1">
                {/* Products & Categories */}
                <DrawerClose asChild>
                  <Link
                    href="/products"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors text-foreground",
                      pathname === "/products"
                        ? "font-medium bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Package className="h-5 w-5" />
                    <span>Products</span>
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/categories"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors text-foreground",
                      pathname === "/categories"
                        ? "font-medium bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <FolderTree className="h-5 w-5" />
                    <span>Categories</span>
                  </Link>
                </DrawerClose>

                {/* Separator */}
                <div className="h-px bg-border my-2" />

                {/* Supply on OXM */}
                <DrawerClose asChild>
                  <Link
                    href="/supplier"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors text-foreground",
                      pathname?.startsWith("/supplier")
                        ? "font-medium bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Store className="h-5 w-5" />
                    <span>Supply on OXM</span>
                  </Link>
                </DrawerClose>

                {/* Separator */}
                <div className="h-px bg-border my-2" />

                {/* Messages & Alerts */}
                <DrawerClose asChild>
                  <Link
                    href="/messages"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors text-foreground",
                      pathname === "/messages"
                        ? "font-medium bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    href="/notifications"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors text-foreground",
                      pathname === "/notifications"
                        ? "font-medium bg-muted"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Alerts</span>
                  </Link>
                </DrawerClose>

                {/* Separator */}
                <div className="h-px bg-border my-2" />

                {/* Login/Logout */}
                {isAuthenticated ? (
                  <DrawerClose asChild>
                    <LogoutButton
                      variant="ghost"
                      className="w-full justify-start gap-3 px-4 py-3 text-base text-foreground hover:bg-muted/50"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </LogoutButton>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 text-base rounded-lg transition-colors text-foreground hover:bg-muted/50"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  </DrawerClose>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </header>
    </>
  );
};
