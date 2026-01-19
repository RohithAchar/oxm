"use client";

import * as React from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Category } from "@/app/categories/page";

// High-contrast palette (no child-based colors)
const categoryColors: string[] = [
  "bg-emerald-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-teal-600",
];

// Convert `icon` string from DB (e.g. "car-front", "shopping-bag") to Lucide icon
const getIconComponent = (iconName: string | null): LucideIcon => {
  if (!iconName) return Icons.Package;
  const pascalCase = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return (Icons as any)[pascalCase] || Icons.Package;
};

// Function to get color index (ensures consistent colors)
const getColorIndex = (categoryName: string, index: number): number => {
  // Try to match by name first
  const name = categoryName.toLowerCase();
  if (name.includes("fashion") || name.includes("apparel")) return 0;
  if (name.includes("beauty")) return 1;
  if (name.includes("electronic")) return 2;
  if (name.includes("jewellery") || name.includes("jewelry")) return 3;
  if (name.includes("footwear") || name.includes("shoe")) return 4;
  if (name.includes("toy")) return 5;
  if (name.includes("furniture")) return 6;
  if (name.includes("mobile") || name.includes("phone")) return 7;

  // Fallback to index-based
  return index % categoryColors.length;
};

interface CategoriesGridProps {
  categories: Category[];
}

const CategoriesGrid = ({ categories }: CategoriesGridProps) => {
  const [openId, setOpenId] = React.useState<string | null>(null);

  const decorated = categories.map((category, index) => {
    const colorIndex = getColorIndex(category.name, index);
    const bgColor = categoryColors[colorIndex] || categoryColors[0] || "bg-emerald-500";
    const Icon = getIconComponent(category.icon);
    return { category, bgColor, Icon };
  });

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {decorated.map(({ category, bgColor, Icon }) => {
          return (
            <button
              key={category.id}
              onClick={() => setOpenId(category.id)}
              className={`${bgColor} text-white rounded-xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer min-h-[140px] shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:brightness-[1.05] hover:-translate-y-0.5`}
            >
              <Icon className="h-12 w-12 text-white stroke-2 drop-shadow-sm" />
              <span className="text-white font-semibold text-center text-base sm:text-lg drop-shadow-sm">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      {decorated.map(({ category, bgColor }) => {
        const isOpen = openId === category.id;
        const childBgColor = bgColor || categoryColors[0] || "bg-emerald-500";
        return (
          <Sheet
            key={category.id}
            open={isOpen}
            onOpenChange={(value) => {
              if (!value) setOpenId(null);
            }}
          >
            <SheetContent
              side="bottom"
              className="h-[70vh] sm:h-[60vh] overflow-y-auto"
            >
              <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <SheetHeader className="flex flex-col gap-2">
                <SheetTitle className="text-lg font-semibold">{category.name}</SheetTitle>
                <div className="flex gap-3 items-center">
                  <Button asChild variant="secondary" size="sm" className="text-sm">
                    <Link href={`/category/${category.slug}`}>All</Link>
                  </Button>
                </div>
              </SheetHeader>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 px-2 sm:px-0">
                {category.children && category.children.length > 0 ? (
                  category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/category/${child.slug}`}
                      className={`${childBgColor} text-white flex items-center justify-center text-center gap-2 rounded-md px-3 py-3 min-h-[64px] text-sm font-semibold shadow-sm hover:scale-[1.01] transition-transform`}
                    >
                      <span className="truncate">{child.name}</span>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No subcategories yet.</div>
                )}
              </div>
              </div>
            </SheetContent>
          </Sheet>
        );
      })}
    </>
  );
};

export default CategoriesGrid;
