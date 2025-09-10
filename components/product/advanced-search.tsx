"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  MapPin,
  Tag,
  Palette,
  Ruler,
  Star,
  Package,
  Truck,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Types for filters
interface FilterState {
  category: string;
  subcategory: string;
  priceMin: string;
  priceMax: string;
  city: string;
  state: string;
  sampleAvailable: boolean | undefined;
  dropshipAvailable: boolean | undefined;
  tags: string[];
  colors: string[];
  sizes: string[];
  sortBy: string;
}

// Types for filter options
interface FilterOptions {
  availableCategories: Array<{ id: string; name: string; count: number }>;
  availableSubcategories: Array<{ id: string; name: string; parent_id: string; count: number }>;
  availableCities: Array<{ name: string; count: number }>;
  availableStates: Array<{ name: string; count: number }>;
  availableTags: Array<{ name: string; count: number }>;
  availableColors: Array<{ name: string; count: number }>;
  availableSizes: Array<{ name: string; count: number }>;
  priceRange: { min: number; max: number };
}

interface AdvancedSearchProps {
  filterOptions?: FilterOptions;
}

const initialFilters: FilterState = {
  category: "",
  subcategory: "",
  priceMin: "",
  priceMax: "",
  city: "",
  state: "",
  sampleAvailable: undefined,
  dropshipAvailable: undefined,
  tags: [],
  colors: [],
  sizes: [],
  sortBy: "created_at_desc",
};

// Sort options
const sortOptions = [
  { value: "created_at_desc", label: "Newest First", icon: <SortDesc className="w-4 h-4" /> },
  { value: "created_at_asc", label: "Oldest First", icon: <SortAsc className="w-4 h-4" /> },
  { value: "price_asc", label: "Price: Low to High", icon: <SortAsc className="w-4 h-4" /> },
  { value: "price_desc", label: "Price: High to Low", icon: <SortDesc className="w-4 h-4" /> },
  { value: "name_asc", label: "Name: A to Z", icon: <SortAsc className="w-4 h-4" /> },
  { value: "name_desc", label: "Name: Z to A", icon: <SortDesc className="w-4 h-4" /> },
];


export function AdvancedSearch({ filterOptions }: AdvancedSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Initialize filters from URL params
  useEffect(() => {
    const newFilters = { ...initialFilters };
    
    // Parse URL parameters
    searchParams.forEach((value, key) => {
      switch (key) {
        case "category":
          newFilters.category = value;
          break;
        case "subcategory":
          newFilters.subcategory = value;
          break;
        case "price_min":
          newFilters.priceMin = value;
          break;
        case "price_max":
          newFilters.priceMax = value;
          break;
        case "city":
          newFilters.city = value;
          break;
        case "state":
          newFilters.state = value;
          break;
        case "sample_available":
          newFilters.sampleAvailable = value === "true";
          break;
        case "dropship_available":
          newFilters.dropshipAvailable = value === "true";
          break;
        case "tags":
          newFilters.tags = value.split(",").filter(Boolean);
          break;
        case "colors":
          newFilters.colors = value.split(",").filter(Boolean);
          break;
        case "sizes":
          newFilters.sizes = value.split(",").filter(Boolean);
          break;
        case "sort":
          newFilters.sortBy = value;
          break;
      }
    });
    
    setFilters(newFilters);
  }, [searchParams]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    // Map filter keys to URL parameter names
    const paramMapping: Record<string, string> = {
      category: "category",
      subcategory: "subcategory", 
      priceMin: "price_min",
      priceMax: "price_max",
      city: "city",
      state: "state",
      sampleAvailable: "sample_available",
      dropshipAvailable: "dropship_available",
      tags: "tags",
      colors: "colors",
      sizes: "sizes",
      sortBy: "sort"
    };
    
    // Add non-empty filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value === "" || value === false || value === undefined || (Array.isArray(value) && value.length === 0)) {
        return;
      }
      
      const paramName = paramMapping[key];
      if (paramName) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(paramName, value.join(","));
          }
        } else {
          params.set(paramName, String(value));
        }
      }
    });
    
    // Reset to first page when filters change
    params.delete("page");
    
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    router.push(pathname);
    setIsOpen(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.priceMin || filters.priceMax) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.sampleAvailable === true) count++;
    if (filters.dropshipAvailable === true) count++;
    if (filters.tags.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.sortBy !== "created_at_desc") count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6 p-4">
      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <Collapsible open={expandedSections.has("categories")} onOpenChange={() => toggleSection("categories")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <span>Categories</span>
          {expandedSections.has("categories") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value, subcategory: "" })}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {filterOptions?.availableCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {filters.category && (
            <Select value={filters.subcategory} onValueChange={(value) => updateFilters({ subcategory: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subcategories</SelectItem>
                {filterOptions?.availableSubcategories
                  .filter(sub => sub.parent_id === filters.category)
                  .map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={expandedSections.has("price")} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <span>Price Range</span>
          {expandedSections.has("price") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min Price"
              value={filters.priceMin}
              onChange={(e) => updateFilters({ priceMin: e.target.value })}
              min={filterOptions?.priceRange?.min || 0}
              max={filterOptions?.priceRange?.max || 100000}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={filters.priceMax}
              onChange={(e) => updateFilters({ priceMax: e.target.value })}
              min={filterOptions?.priceRange?.min || 0}
              max={filterOptions?.priceRange?.max || 100000}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Location */}
      <Collapsible open={expandedSections.has("location")} onOpenChange={() => toggleSection("location")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Location</span>
          </div>
          {expandedSections.has("location") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <Select value={filters.state} onValueChange={(value) => updateFilters({ state: value, city: "" })}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All States</SelectItem>
              {filterOptions?.availableStates.map((state) => (
                <SelectItem key={state.name} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filters.city} onValueChange={(value) => updateFilters({ city: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cities</SelectItem>
              {filterOptions?.availableCities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CollapsibleContent>
      </Collapsible>

      {/* Quick Filters */}
      <Collapsible open={expandedSections.has("quick")} onOpenChange={() => toggleSection("quick")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <span>Quick Filters</span>
          {expandedSections.has("quick") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.sampleAvailable === true}
                onChange={(e) => updateFilters({ sampleAvailable: e.target.checked ? true : undefined })}
                className="rounded"
              />
              <span className="text-sm">Sample Available</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.dropshipAvailable === true}
                onChange={(e) => updateFilters({ dropshipAvailable: e.target.checked ? true : undefined })}
                className="rounded"
              />
              <span className="text-sm">Dropship Available</span>
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Tags */}
      <Collapsible open={expandedSections.has("tags")} onOpenChange={() => toggleSection("tags")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>Tags</span>
          </div>
          {expandedSections.has("tags") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="flex flex-wrap gap-2">
            {filterOptions?.availableTags.map((tag) => (
              <Badge
                key={tag.name}
                variant={filters.tags.includes(tag.name) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const newTags = filters.tags.includes(tag.name)
                    ? filters.tags.filter(t => t !== tag.name)
                    : [...filters.tags, tag.name];
                  updateFilters({ tags: newTags });
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible open={expandedSections.has("colors")} onOpenChange={() => toggleSection("colors")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Colors</span>
          </div>
          {expandedSections.has("colors") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="flex flex-wrap gap-2">
            {filterOptions?.availableColors.map((color) => (
              <Badge
                key={color.name}
                variant={filters.colors.includes(color.name) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const newColors = filters.colors.includes(color.name)
                    ? filters.colors.filter(c => c !== color.name)
                    : [...filters.colors, color.name];
                  updateFilters({ colors: newColors });
                }}
              >
                {color.name}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible open={expandedSections.has("sizes")} onOpenChange={() => toggleSection("sizes")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            <span>Sizes</span>
          </div>
          {expandedSections.has("sizes") ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div className="flex flex-wrap gap-2">
            {filterOptions?.availableSizes.map((size) => (
              <Badge
                key={size.name}
                variant={filters.sizes.includes(size.name) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  const newSizes = filters.sizes.includes(size.name)
                    ? filters.sizes.filter(s => s !== size.name)
                    : [...filters.sizes, size.name];
                  updateFilters({ sizes: newSizes });
                }}
              >
                {size.name}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={clearFilters}>
          Clear All
        </Button>
      </div>
    </div>
  );

  const activeFiltersCount = getActiveFiltersCount();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <FilterContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <FilterContent />
      </SheetContent>
    </Sheet>
  );
}

