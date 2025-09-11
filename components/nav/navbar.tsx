"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, MessageSquare, Truck, User, Search } from "lucide-react";
import { ModeToggle } from "./theme-toggle-button";
import { usePathname, useRouter } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const showThemeToggle = pathname?.startsWith("/admin") || pathname?.startsWith("/supplier");
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
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <form
                className="w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget as HTMLFormElement);
                  const q = String(formData.get("q") || "").trim();
                  if (q.length > 0) {
                    router.push(`/products?q=${encodeURIComponent(q)}`);
                  } else {
                    router.push("/products");
                  }
                }}
              >
                <div className="flex items-center h-10 w-full rounded-full border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring transition-colors">
                  <div className="pl-3 pr-1 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    name="q"
                    placeholder="Search products & suppliers"
                    className="h-full w-full bg-transparent dark:bg-transparent border-0 shadow-none px-2 text-sm focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0"
                  />
                  <Button type="submit" size="sm" className="mr-1 h-8 rounded-full px-4">
                    Search
                  </Button>
                </div>
              </form>
            </div>
          )}
          <div className="flex items-center gap-1 sm:gap-2">
            {showThemeToggle && <ModeToggle />}
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Messages">
              <Link href="/messages">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" aria-label="Orders">
              <Truck className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Profile">
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        <div className={`max-w-7xl mx-auto px-3 ${showSearch ? "py-2" : "py-3"} flex items-center gap-2`}>
          <Link href="/" className="font-semibold text-lg leading-none">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
          </Link>
          {showSearch && (
            <form
              className="flex-1"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget as HTMLFormElement);
                const q = String(formData.get("q") || "").trim();
                if (q.length > 0) {
                  router.push(`/products?q=${encodeURIComponent(q)}`);
                } else {
                  router.push("/products");
                }
              }}
            >
              <div className="flex items-center h-10 w-full rounded-full border border-input bg-transparent focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring transition-colors">
                <div className="pl-3 pr-1 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <Input
                  name="q"
                  placeholder="Search products & suppliers"
                  className="h-full w-full bg-transparent dark:bg-transparent border-0 shadow-none px-1.5 text-sm focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0"
                />
                <Button type="submit" size="sm" className="mr-1 h-8 rounded-full px-3">
                  Go
                </Button>
              </div>
            </form>
          )}
        </div>
      </header>
    </>
  );
};
