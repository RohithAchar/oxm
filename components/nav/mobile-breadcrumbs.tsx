"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function MobileBreadcrumbs() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
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
  }, []);

  // If on home page, show navigation links
  if (pathname === "/") {
    return (
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList className="gap-1 flex-nowrap">
            <BreadcrumbItem className="flex-shrink-0">
              <Popover open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[11px] font-normal text-muted-foreground hover:text-foreground whitespace-nowrap"
                  >
                    Categories
                    <ChevronDown className="ml-0.5 h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[280px] p-2 max-h-[400px] overflow-y-auto"
                  align="start"
                >
                  <div className="space-y-1">
                    <Link
                      href="/categories"
                      className="block px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
                      onClick={() => setCategoriesOpen(false)}
                    >
                      View All Categories
                    </Link>
                    <div className="border-t my-2" />
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex-shrink-0" />
            <BreadcrumbItem className="flex-shrink-0">
              <BreadcrumbLink
                href="/products"
                className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Products
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex-shrink-0" />
            <BreadcrumbItem className="flex-shrink-0">
              <BreadcrumbLink
                href="/supplier"
                className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Supplier
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="flex-shrink-0" />
            <BreadcrumbItem className="flex-shrink-0">
              <BreadcrumbLink
                href="/contact"
                className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap"
              >
                Contact
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    );
  }

  // For other pages, show regular breadcrumbs
  const parts = pathname.split("/").filter(Boolean);
  const segments: { label: string; href: string }[] = [];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    segments.push({
      label: part
        .replace(/[-_]+/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      href: current,
    });
  }

  return (
    <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide px-1 min-w-0">
      <Breadcrumb>
        <BreadcrumbList className="gap-1 flex-nowrap">
          <BreadcrumbItem className="flex-shrink-0">
            <BreadcrumbLink
              href="/"
              className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((seg, index) => (
            <React.Fragment key={seg.href}>
              <BreadcrumbSeparator className="flex-shrink-0" />
              <BreadcrumbItem className="flex-shrink-0">
                {index === segments.length - 1 ? (
                  <BreadcrumbPage className="text-[11px] whitespace-nowrap">
                    {seg.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={seg.href}
                    className="text-[11px] text-muted-foreground hover:text-foreground whitespace-nowrap"
                  >
                    {seg.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
