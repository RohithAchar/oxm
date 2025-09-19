"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductSearch from "@/components/search/ProductSearch";
import { MessageSquare, User } from "lucide-react";
import { ModeToggle } from "./theme-toggle-button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const showThemeToggle =
    pathname?.startsWith("/admin") || pathname?.startsWith("/supplier");
  const showSearch = !(pathname?.startsWith("/supplier") ?? false);
  const isSupplier = pathname?.startsWith("/supplier");

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
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background">
        <div
          className={`${
            isSupplier ? "hidden max-w-full" : "max-w-screen-2xl"
          } mx-auto px-4 lg:px-0 h-14 grid grid-cols-[auto_1fr_auto] items-center`}
        >
          <Link href="/" className="font-semibold text-xl mr-4 md:mr-5 lg:mr-6">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
            <span className="text-muted-foreground text-xs">.com</span>
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
              <ProductSearch
                placeholder="Search products"
                size="sm"
                rounded="full"
                className="w-full max-w-xl mx-auto"
                buttonMode="icon"
              />
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
      </header>

      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        <div
          className={`${
            isSupplier ? "hidden max-w-screen-2xl" : "max-w-7xl"
          } mx-auto px-3 h-14 flex items-center justify-between gap-4`}
        >
          <Link href="/" className="font-semibold text-lg leading-none">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
          </Link>
          {isSupplier ? (
            <Drawer>
              <DrawerTrigger asChild>
                <button
                  aria-label="Open supplier navigation"
                  className="p-2 -mr-1 text-muted-foreground hover:text-foreground"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent className="p-2">
                <nav className="grid">
                  {supplierNav.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "px-3 py-3 text-base",
                          active
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </DrawerContent>
            </Drawer>
          ) : (
            showSearch && (
              <div className="flex-1">
                <ProductSearch
                  placeholder="Search products"
                  size="sm"
                  rounded="full"
                  buttonMode="icon"
                />
              </div>
            )
          )}
        </div>
      </header>
    </>
  );
};
