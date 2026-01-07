"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description?: string | null;
}

export function NavigationMenuHome() {
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        // Filter to only show top-level categories (parent_id is null)
        const topLevelCategories = (data.categories || []).filter(
          (cat: any) => !cat.parent_id
        );
        setCategories(topLevelCategories); // Show all categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getIconComponent = (iconName: string | null): LucideIcon => {
    if (!iconName) return Icons.Circle;
    const pascalCase = iconName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
    return (Icons as any)[pascalCase] || Icons.Circle;
  };

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex items-center justify-between w-screen max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent className="!w-[1200px] max-w-[95vw]">
              <div className="w-full p-6">
                <div className="flex gap-6 items-start">
                  {/* Explore All Categories Link */}
                  <div className="flex-shrink-0 w-[240px]">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full flex-col justify-start rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 p-5 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md hover:shadow-lg border border-primary/20 hover:border-primary/40"
                        href="/categories"
                      >
                        <div className="mb-3 text-base font-semibold text-foreground">
                          Explore All Categories
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Browse all categories and find products you need.
                        </p>
                        <div className="mt-4 text-xs text-primary font-medium">
                          View all →
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>

                  {/* Categories List */}
                  {loading ? (
                    <div className="p-3 text-sm text-muted-foreground">
                      Loading categories...
                    </div>
                  ) : categories.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 flex-1">
                      {categories.map((category) => {
                        return (
                          <ListItem
                            key={category.id}
                            href={`/category/${category.slug}`}
                            title={category.name}
                          >
                            {category.description ||
                              `Browse ${category.name} products`}
                          </ListItem>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 text-sm text-muted-foreground">
                      No categories available
                    </div>
                  )}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/products">Products</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Buyer Protection</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="h-[200px] w-[500px] flex items-center justify-center">
                Content will be displayed here.
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </div>
        <div className="flex items-center justify-between gap-8">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/contact">Contact Us</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/supplier">Supply on OpenXmart</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props} className="w-full">
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block p-3 rounded-lg hover:bg-muted transition-colors group"
        >
          <div className="text-sm font-medium mb-1 truncate group-hover:text-foreground">
            {title}
          </div>
          <p className="text-muted-foreground text-xs leading-snug line-clamp-2">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
