"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useQueryStates, parseAsString, parseAsArrayOf } from "nuqs";
 

export function ActiveFilters() {
  const [query, setQuery] = useQueryStates({
    category: parseAsString,
    subcategory: parseAsString,
    price_min: parseAsString,
    price_max: parseAsString,
    city: parseAsString,
    state: parseAsString,
    sample_available: parseAsString,
    dropship_available: parseAsString,
    tags: parseAsArrayOf(parseAsString),
    colors: parseAsArrayOf(parseAsString),
    sizes: parseAsArrayOf(parseAsString),
    sort: parseAsString,
    page: parseAsString,
  }, { shallow: false, clearOnDefault: true });

  const removeFilter = (key: string, value?: string) => {
    if (key === "price_min" || key === "price_max") {
      setQuery({ price_min: null as any, price_max: null as any, page: null as any } as any);
      return;
    }
    if (value) {
      const currentValues = (query as any)[key] || [];
      const newValues = currentValues.filter((v: string) => v !== value);
      setQuery({ [key]: newValues.length > 0 ? newValues : null, page: null as any } as any);
    } else {
      setQuery({ [key]: null as any, page: null as any } as any);
    }
  };

  const clearAllFilters = () => {
    setQuery({
      category: null as any,
      subcategory: null as any,
      price_min: null as any,
      price_max: null as any,
      city: null as any,
      state: null as any,
      sample_available: null as any,
      dropship_available: null as any,
      tags: null as any,
      colors: null as any,
      sizes: null as any,
      sort: null as any,
      page: null as any,
    });
  };

  const getActiveFilters = () => {
    const filters: Array<{ key: string; label: string; value: string; type: 'single' | 'array' }> = [];


    // Category
    const category = query.category;
    if (category) {
      filters.push({ key: "category", label: "Category", value: category, type: 'single' });
    }

    // Subcategory
    const subcategory = query.subcategory;
    if (subcategory) {
      filters.push({ key: "subcategory", label: "Subcategory", value: subcategory, type: 'single' });
    }

    // Price range
    const priceMin = query.price_min;
    const priceMax = query.price_max;
    if (priceMin || priceMax) {
      const priceRange = `₹${priceMin || "0"} - ₹${priceMax || "∞"}`;
      filters.push({ key: "price_min", label: "Price", value: priceRange, type: 'single' });
    }

    // Location
    const city = query.city;
    if (city) {
      filters.push({ key: "city", label: "City", value: city, type: 'single' });
    }

    const state = query.state;
    if (state) {
      filters.push({ key: "state", label: "State", value: state, type: 'single' });
    }


    if (query.sample_available === "true") {
      filters.push({ key: "sample_available", label: "Sample", value: "Sample Available", type: 'single' });
    }

    if (query.dropship_available === "true") {
      filters.push({ key: "dropship_available", label: "Dropship", value: "Dropship Available", type: 'single' });
    }

    // Array filters
    const tags = query.tags;
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        filters.push({ key: "tags", label: "Tag", value: tag, type: 'array' });
      });
    }

    const colors = query.colors;
    if (colors && colors.length > 0) {
      colors.forEach(color => {
        filters.push({ key: "colors", label: "Color", value: color, type: 'array' });
      });
    }

    const sizes = query.sizes;
    if (sizes && sizes.length > 0) {
      sizes.forEach(size => {
        filters.push({ key: "sizes", label: "Size", value: size, type: 'array' });
      });
    }

    // Sort (only show if not default)
    const sort = query.sort;
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
          variant="link"
          size="sm"
          onClick={clearAllFilters}
          aria-label="Clear all filters"
          title="Clear all filters"
          className="h-auto p-0 text-xs text-primary underline-offset-4 hover:underline cursor-pointer"
        >
          <X className="mr-1 h-3 w-3" />
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
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
