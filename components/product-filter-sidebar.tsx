"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X, Filter, Menu } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  subcategories?: Category[];
}

interface FilterState {
  categories: string[];
  subcategories: string[];
}

const FilterSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-6">
      <Filter className="h-5 w-5" />
      <h2 className="text-lg font-semibold">Filters</h2>
    </div>
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  </div>
);

const ActiveFilterBadge = ({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) => (
  <Badge variant="secondary" className="flex items-center gap-1 pr-1">
    <span className="text-xs">{name}</span>
    <Button
      variant="ghost"
      size="sm"
      onClick={onRemove}
      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
    >
      <X className="h-3 w-3" />
    </Button>
  </Badge>
);

const FilterContent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Memoized category finder
  const findCategoryById = useCallback(
    (id: string): Category | null => {
      for (const category of categories) {
        if (category.id === id) return category;
        if (category.subcategories) {
          for (const subcategory of category.subcategories) {
            if (subcategory.id === id) return subcategory;
          }
        }
      }
      return null;
    },
    [categories]
  );

  // Load categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (error) throw error;

        // Build category hierarchy
        const categoryMap = new Map<string, Category>();
        const rootCategories: Category[] = [];

        // Create category map
        data.forEach((cat) => {
          categoryMap.set(cat.id, { ...cat, subcategories: [] });
        });

        // Build hierarchy
        data.forEach((cat) => {
          const category = categoryMap.get(cat.id)!;

          if (cat.parent_id) {
            const parent = categoryMap.get(cat.parent_id);
            parent?.subcategories?.push(category);
          } else {
            rootCategories.push(category);
          }
        });

        setCategories(rootCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [supabase]);

  // Initialize filters from URL
  useEffect(() => {
    const categoryParams = searchParams.get("categories");
    const subcategoryParams = searchParams.get("subcategories");

    setFilters({
      categories: categoryParams?.split(",").filter(Boolean) || [],
      subcategories: subcategoryParams?.split(",").filter(Boolean) || [],
    });
  }, [searchParams]);

  // Update URL with new filters
  const updateURL = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams(searchParams);

      if (newFilters.categories.length > 0) {
        params.set("categories", newFilters.categories.join(","));
      } else {
        params.delete("categories");
      }

      if (newFilters.subcategories.length > 0) {
        params.set("subcategories", newFilters.subcategories.join(","));
      } else {
        params.delete("subcategories");
      }

      router.push(`${window.location.pathname}?${params.toString()}`);
    },
    [searchParams, router]
  );

  // Toggle category filter
  const toggleCategory = useCallback(
    (categoryId: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev };

        if (newFilters.categories.includes(categoryId)) {
          // Remove category and its subcategories
          newFilters.categories = newFilters.categories.filter(
            (id) => id !== categoryId
          );

          const category = findCategoryById(categoryId);
          if (category?.subcategories) {
            const subcategoryIds = category.subcategories.map((sub) => sub.id);
            newFilters.subcategories = newFilters.subcategories.filter(
              (id) => !subcategoryIds.includes(id)
            );
          }
        } else {
          newFilters.categories.push(categoryId);
        }

        updateURL(newFilters);
        return newFilters;
      });
    },
    [findCategoryById, updateURL]
  );

  // Toggle subcategory filter
  const toggleSubcategory = useCallback(
    (subcategoryId: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev };

        if (newFilters.subcategories.includes(subcategoryId)) {
          newFilters.subcategories = newFilters.subcategories.filter(
            (id) => id !== subcategoryId
          );
        } else {
          newFilters.subcategories.push(subcategoryId);
        }

        updateURL(newFilters);
        return newFilters;
      });
    },
    [updateURL]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    const newFilters = { categories: [], subcategories: [] };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [updateURL]);

  const activeFiltersCount =
    filters.categories.length + filters.subcategories.length;

  if (loading) {
    return <FilterSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="rounded-full">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground rounded-md"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Active Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map((categoryId) => {
              const category = findCategoryById(categoryId);
              return category ? (
                <ActiveFilterBadge
                  key={categoryId}
                  name={category.name}
                  onRemove={() => toggleCategory(categoryId)}
                />
              ) : null;
            })}
            {filters.subcategories.map((subcategoryId) => {
              const subcategory = findCategoryById(subcategoryId);
              return subcategory ? (
                <ActiveFilterBadge
                  key={subcategoryId}
                  name={subcategory.name}
                  onRemove={() => toggleSubcategory(subcategoryId)}
                />
              ) : null;
            })}
          </div>
          <Separator />
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Categories
        </h3>
        <Accordion type="multiple" className="w-full">
          {categories.map((category) => (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="border-none"
            >
              <AccordionTrigger className="py-3 hover:no-underline rounded-lg hover:bg-muted px-2">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-md"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {category.name}
                  </Label>
                </div>
              </AccordionTrigger>
              {category.subcategories && category.subcategories.length > 0 && (
                <AccordionContent className="pt-2 pb-4">
                  <div className="pl-6 space-y-3">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50"
                      >
                        <Checkbox
                          id={`subcategory-${subcategory.id}`}
                          checked={filters.subcategories.includes(
                            subcategory.id
                          )}
                          onCheckedChange={() =>
                            toggleSubcategory(subcategory.id)
                          }
                          className="rounded-md"
                        />
                        <Label
                          htmlFor={`subcategory-${subcategory.id}`}
                          className="text-sm cursor-pointer text-muted-foreground hover:text-foreground"
                        >
                          {subcategory.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export function ProductFilterSidebar() {
  return (
    <>
      {/* Mobile Filter */}
      <div className="lg:hidden">
        <div className="fixed bottom-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg shadow-md"
              >
                <Menu className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <FilterContent />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Filter */}
      <div className="hidden lg:block w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <FilterContent />
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
