"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronRight } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SupplierNavItem {
  name: string;
  href: string;
}

interface MobileHamburgerMenuProps {
  isSupplier: boolean;
  supplierNav: SupplierNavItem[];
}

export function MobileHamburgerMenu({
  isSupplier,
  supplierNav,
}: MobileHamburgerMenuProps) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    if (!isSupplier) {
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/categories");
          if (!response.ok) throw new Error("Failed to fetch categories");
          const data = await response.json();
          const topLevelCategories = (data.categories || []).filter(
            (cat: any) => !cat.parent_id
          );
          setCategories(topLevelCategories);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };

      fetchCategories();
    }
  }, [isSupplier]);

  if (isSupplier) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <nav className="space-y-1">
            {supplierNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block px-4 py-3 text-base rounded-lg transition-colors",
                    active
                      ? "text-foreground font-medium bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 max-h-[85vh] overflow-y-auto">
        <nav className="space-y-1">
          {/* Categories */}
          <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 text-base rounded-lg transition-colors",
                  categoriesOpen
                    ? "text-foreground font-medium bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span>Categories</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    categoriesOpen && "rotate-90"
                  )}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
              <Link
                href="/categories"
                className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                onClick={() => setCategoriesOpen(false)}
              >
                View All Categories
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                  onClick={() => setCategoriesOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Products */}
          <Link
            href="/products"
            className={cn(
              "block px-4 py-3 text-base rounded-lg transition-colors",
              pathname === "/products"
                ? "text-foreground font-medium bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            Products
          </Link>

          {/* Supplier */}
          <Link
            href="/supplier"
            className={cn(
              "block px-4 py-3 text-base rounded-lg transition-colors",
              pathname?.startsWith("/supplier")
                ? "text-foreground font-medium bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            Supply on OpenXmart
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className={cn(
              "block px-4 py-3 text-base rounded-lg transition-colors",
              pathname === "/contact"
                ? "text-foreground font-medium bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            Contact Us
          </Link>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
