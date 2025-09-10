"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function ActiveFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const removeFilter = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      // For array filters (tags, colors, sizes)
      const currentValues = params.get(key)?.split(",").filter(Boolean) || [];
      const newValues = currentValues.filter(v => v !== value);
      
      if (newValues.length > 0) {
        params.set(key, newValues.join(","));
      } else {
        params.delete(key);
      }
    } else {
      // For single value filters
      params.delete(key);
    }
    
    params.delete("page"); // Reset to first page
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  const getActiveFilters = () => {
    const filters: Array<{ key: string; label: string; value: string; type: 'single' | 'array' }> = [];


    // Category
    const category = searchParams.get("category");
    if (category) {
      filters.push({ key: "category", label: "Category", value: category, type: 'single' });
    }

    // Subcategory
    const subcategory = searchParams.get("subcategory");
    if (subcategory) {
      filters.push({ key: "subcategory", label: "Subcategory", value: subcategory, type: 'single' });
    }

    // Price range
    const priceMin = searchParams.get("price_min");
    const priceMax = searchParams.get("price_max");
    if (priceMin || priceMax) {
      const priceRange = `₹${priceMin || "0"} - ₹${priceMax || "∞"}`;
      filters.push({ key: "price", label: "Price", value: priceRange, type: 'single' });
    }

    // Location
    const city = searchParams.get("city");
    if (city) {
      filters.push({ key: "city", label: "City", value: city, type: 'single' });
    }

    const state = searchParams.get("state");
    if (state) {
      filters.push({ key: "state", label: "State", value: state, type: 'single' });
    }


    if (searchParams.get("sample_available") === "true") {
      filters.push({ key: "sample_available", label: "Sample", value: "Sample Available", type: 'single' });
    }

    if (searchParams.get("dropship_available") === "true") {
      filters.push({ key: "dropship_available", label: "Dropship", value: "Dropship Available", type: 'single' });
    }

    // Array filters
    const tags = searchParams.get("tags");
    if (tags) {
      tags.split(",").forEach(tag => {
        filters.push({ key: "tags", label: "Tag", value: tag, type: 'array' });
      });
    }

    const colors = searchParams.get("colors");
    if (colors) {
      colors.split(",").forEach(color => {
        filters.push({ key: "colors", label: "Color", value: color, type: 'array' });
      });
    }

    const sizes = searchParams.get("sizes");
    if (sizes) {
      sizes.split(",").forEach(size => {
        filters.push({ key: "sizes", label: "Size", value: size, type: 'array' });
      });
    }

    // Sort (only show if not default)
    const sort = searchParams.get("sort");
    if (sort && sort !== "created_at_desc") {
      const sortLabels: Record<string, string> = {
        "created_at_asc": "Oldest First",
        "price_asc": "Price: Low to High",
        "price_desc": "Price: High to Low",
        "name_asc": "Name: A to Z",
        "name_desc": "Name: Z to A",
        "verified_desc": "Verified First",
      };
      filters.push({ key: "sort", label: "Sort", value: sortLabels[sort] || sort, type: 'single' });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Active Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-6 px-2 text-xs"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <Badge
            key={`${filter.key}-${filter.value}-${index}`}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            <span className="text-xs">
              {filter.label}: {filter.value}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFilter(filter.key, filter.type === 'array' ? filter.value : undefined)}
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
