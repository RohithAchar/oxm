"use client";
import { useEffect, useState } from "react";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
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
import { Skeleton } from "../ui/skeleton";
import { Database } from "@/utils/supabase/database.types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface CategoryWithChildren extends Category {
  children?: Category[];
}

const CategorySidebar = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/categories");

        // Organize categories into parent-child structure
        const allCategories: Category[] = response.data.categories;
        const parentCategories = allCategories.filter(
          (cat) => cat.parent_id === null
        );
        const childCategories = allCategories.filter(
          (cat) => cat.parent_id !== null
        );

        const categoriesWithChildren: CategoryWithChildren[] =
          parentCategories.map((parent) => ({
            ...parent,
            children: childCategories.filter(
              (child) => child.parent_id === parent.id
            ),
          }));

        setCategories(categoriesWithChildren);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isActive = (slug: string) => pathname === `/category/${slug}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto max-h-screen w-80">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-left">Categories</SheetTitle>
          <SheetDescription className="text-left">
            Choose a category to explore products of a similar type.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-1">
          {/* All Products Link */}
          <Link
            href="/"
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-gray-100",
              pathname === "/" ? "text-black font-semibold" : "text-gray-600"
            )}
            onClick={() => setOpen(false)}
          >
            All Products
          </Link>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-2 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-8 w-full rounded-md" />
                  <div className="ml-4 space-y-1">
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-6 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Categories List */
            <div className="pb-12">
              {categories.map((parentCategory) => (
                <div key={parentCategory.id} className="mb-1">
                  {/* Parent Category */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleCategory(parentCategory.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left rounded-md transition-colors hover:bg-gray-100 group"
                    >
                      <Link
                        href={`/category/${parentCategory.slug}`}
                        className={cn(
                          "flex-1 truncate text-sm",
                          isActive(parentCategory.slug)
                            ? "text-black font-semibold"
                            : "text-gray-700"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(false);
                        }}
                      >
                        {parentCategory.name}
                      </Link>

                      {/* {parentCategory.children &&
                        parentCategory.children.length > 0 && (
                          <span className="ml-2 flex-shrink-0">
                            {expandedCategories.has(parentCategory.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                            )}
                          </span>
                        )} */}
                    </button>
                  </div>

                  {/* Child Categories */}
                  {/* {expandedCategories.has(parentCategory.id) &&
                    parentCategory.children &&
                    parentCategory.children.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-3">
                        {parentCategory.children.map((childCategory) => (
                          <Link
                            key={childCategory.id}
                            href={`/category/${childCategory.slug}`}
                            className={cn(
                              "block px-3 py-1.5 text-xs rounded-md transition-colors hover:bg-gray-50 truncate",
                              isActive(childCategory.slug)
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:text-gray-900"
                            )}
                            title={childCategory.name}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpen(false);
                            }}
                          >
                            {childCategory.name}
                          </Link>
                        ))}
                      </div>
                    )} */}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && categories.length === 0 && (
            <div className="px-3 py-8 text-center text-gray-500">
              <p className="text-sm">No categories found</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySidebar;
