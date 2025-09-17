"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductSearch from "@/components/search/ProductSearch";
import { Bell, MessageSquare, Truck, User } from "lucide-react";
import { ModeToggle } from "./theme-toggle-button";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const showThemeToggle =
    pathname?.startsWith("/admin") || pathname?.startsWith("/supplier");
  const showSearch = !(pathname?.startsWith("/supplier") ?? false);
  return (
    <>
      {/* Desktop Topbar */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
            <span className="text-muted-foreground text-xs">.com</span>
          </Link>
          {showSearch && (
            <div className="hidden md:flex flex-1 mx-4 justify-center">
              <ProductSearch
                placeholder="Search products & suppliers"
                size="sm"
                rounded="full"
                className="w-full max-w-2xl"
              />
            </div>
          )}
          <div className="flex items-center gap-1 sm:gap-4">
            {showThemeToggle && <ModeToggle />}
            {/* <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button> */}
            <Link href="/messages">
              <Button asChild variant="ghost" size="icon" aria-label="Messages">
                <MessageSquare className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
            {/* <Button variant="ghost" size="icon" aria-label="Orders">
              <Truck className="h-5 w-5" />
            </Button> */}
            <Link href="/account">
              <Button asChild variant="ghost" size="icon" aria-label="Profile">
                <User className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        <div className={`max-w-7xl mx-auto px-3 h-14 flex items-center gap-2`}>
          <Link href="/" className="font-semibold text-lg leading-none">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
          </Link>
          {showSearch && (
            <div className="flex-1">
              <ProductSearch
                placeholder="Search products & suppliers"
                size="sm"
                rounded="full"
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
};
