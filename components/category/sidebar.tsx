"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { cn } from "@/lib/utils";

import { Category } from "@/types/category";
import { Skeleton } from "../ui/skeleton";

const CategorySidebar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[] | []>([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Sheet>
      <SheetTrigger>
        <Menu strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle>Categories</SheetTitle>
          <SheetDescription>
            Choose a category to explore products of a similar type.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 text-xl font-medium text-muted-foreground flex flex-col gap-4 pb-8">
          <Link href={"/"} className={cn(pathname === "/" && "text-black")}>
            All
          </Link>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-32 rounded" />
              ))
            : categories?.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={cn(
                    pathname === `/category/${category.slug}` && "text-black"
                  )}
                >
                  {category.name}
                </Link>
              ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySidebar;
