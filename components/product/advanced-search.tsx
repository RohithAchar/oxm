"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  useQueryStates,
  parseAsString,
  parseAsArrayOf,
  parseAsBoolean,
} from "nuqs";

// Types for filters
interface FilterState {
  q: string;
  category: string;
  subcategory: string;
  price_min: string;
  price_max: string;
  city: string;
  state: string;
  sample_available: boolean;
  dropship_available: boolean;
  tags: string[];
  colors: string[];
  sizes: string[];
  sort: string;
}

// Types for filter options
interface FilterOptions {
  availableCategories: Array<{ id: string; name: string; count: number }>;
  availableSubcategories: Array<{
    id: string;
    name: string;
    parent_id: string;
    count: number;
  }>;
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
  q: "",
  category: "",
  subcategory: "",
  price_min: "",
  price_max: "",
  city: "",
  state: "",
  sample_available: false,
  dropship_available: false,
  tags: [],
  colors: [],
  sizes: [],
  sort: "created_at_desc",
};

// Sort options
const sortOptions = [
  {
    value: "created_at_desc",
    label: "Newest First",
    icon: <SortDesc className="w-4 h-4" />,
  },
  {
    value: "created_at_asc",
    label: "Oldest First",
    icon: <SortAsc className="w-4 h-4" />,
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
    icon: <SortAsc className="w-4 h-4" />,
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
    icon: <SortDesc className="w-4 h-4" />,
  },
  {
    value: "name_asc",
    label: "Name: A to Z",
    icon: <SortAsc className="w-4 h-4" />,
  },
  {
    value: "name_desc",
    label: "Name: Z to A",
    icon: <SortDesc className="w-4 h-4" />,
  },
];

export function AdvancedSearch({ filterOptions }: AdvancedSearchProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      category: parseAsString.withDefault(""),
      subcategory: parseAsString.withDefault(""),
      price_min: parseAsString.withDefault(""),
      price_max: parseAsString.withDefault(""),
      city: parseAsString.withDefault(""),
      state: parseAsString.withDefault(""),
      sample_available: parseAsBoolean.withDefault(false),
      dropship_available: parseAsBoolean.withDefault(false),
      tags: parseAsArrayOf(parseAsString).withDefault([]),
      colors: parseAsArrayOf(parseAsString).withDefault([]),
      sizes: parseAsArrayOf(parseAsString).withDefault([]),
      sort: parseAsString.withDefault("created_at_desc"),
    },
    { shallow: false, clearOnDefault: true }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  // Local draft state; UI edits go here without updating URL until applied
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilters);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const updateDraftFilters = (updates: Partial<FilterState>) => {
    setDraftFilters((prev) => ({ ...prev, ...updates }));
  };

  const applyFilters = () => {
    setIsApplying(true);
    setFilters(draftFilters);
    setIsOpen(false);
  };

  const applySearch = () => {};

  const clearFilters = () => {
    setDraftFilters(initialFilters);
    setFilters(initialFilters);
    setIsOpen(false);
  };

  // When URL-bound filters change (navigation), stop showing the applying state
  // This makes the Apply button show a spinner only while navigation is pending
  // and the new results are about to render.
  if (process.env.NODE_ENV !== "production") {
    // no-op to satisfy tree-shaking comments; keeps file structure stable
  }

  // Turn off applying state after the URL-synced filters update
  // Note: This effect intentionally depends on the entire filters object
  // so it runs whenever any query param changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isApplying) {
      setIsApplying(false);
    }
  }, [filters]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
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
    if (filters.q) count++;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.price_min || filters.price_max) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.sample_available === true) count++;
    if (filters.dropship_available === true) count++;
    if (filters.tags.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.sort !== "created_at_desc") count++;
    return count;
  };

  const FilterContent = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? "space-y-4 p-3" : "space-y-6 p-4"}>
      {/* Search removed from filter panel */}
      {/* Sort */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select
          value={draftFilters.sort}
          onValueChange={(value) => updateDraftFilters({ sort: value })}
        >
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
      <Collapsible
        open={expandedSections.has("categories")}
        onOpenChange={() => toggleSection("categories")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <span>Categories</span>
          {expandedSections.has("categories") ? (
            <ChevronUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          ) : (
            <ChevronDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent
          className={compact ? "space-y-2 mt-2" : "space-y-3 mt-3"}
        >
          <Select
            value={draftFilters.category}
            onValueChange={(value) =>
              updateDraftFilters({
                category: value === "all" ? "" : value,
                subcategory: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {filterOptions?.availableCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {draftFilters.category && (
            <Select
              value={draftFilters.subcategory}
              onValueChange={(value) =>
                updateDraftFilters({
                  subcategory: value === "all" ? "" : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {filterOptions?.availableSubcategories
                  .filter((sub) => sub.parent_id === filters.category)
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
      <Collapsible
        open={expandedSections.has("price")}
        onOpenChange={() => toggleSection("price")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <span>Price Range</span>
          {expandedSections.has("price") ? (
            <ChevronUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          ) : (
            <ChevronDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent
          className={compact ? "space-y-2 mt-2" : "space-y-3 mt-3"}
        >
          <div
            className={
              compact ? "grid grid-cols-2 gap-1.5" : "grid grid-cols-2 gap-2"
            }
          >
            <Input
              type="number"
              placeholder="Min Price"
              value={draftFilters.price_min}
              onChange={(e) =>
                updateDraftFilters({ price_min: e.target.value })
              }
              min={filterOptions?.priceRange?.min || 0}
              max={filterOptions?.priceRange?.max || 100000}
            />
            <Input
              type="number"
              placeholder="Max Price"
              value={draftFilters.price_max}
              onChange={(e) =>
                updateDraftFilters({ price_max: e.target.value })
              }
              min={filterOptions?.priceRange?.min || 0}
              max={filterOptions?.priceRange?.max || 100000}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Location */}
      <Collapsible
        open={expandedSections.has("location")}
        onOpenChange={() => toggleSection("location")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <MapPin className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            <span>Location</span>
          </div>
          {expandedSections.has("location") ? (
            <ChevronUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          ) : (
            <ChevronDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent
          className={compact ? "space-y-2 mt-2" : "space-y-3 mt-3"}
        >
          <Select
            value={draftFilters.state}
            onValueChange={(value) =>
              updateDraftFilters({
                state: value === "all" ? "" : value,
                city: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {filterOptions?.availableStates.map((state) => (
                <SelectItem key={state.name} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={draftFilters.city}
            onValueChange={(value) =>
              updateDraftFilters({ city: value === "all" ? "" : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
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
      <Collapsible
        open={expandedSections.has("quick")}
        onOpenChange={() => toggleSection("quick")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <span>Quick Filters</span>
          {expandedSections.has("quick") ? (
            <ChevronUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          ) : (
            <ChevronDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent
          className={compact ? "space-y-2 mt-2" : "space-y-3 mt-3"}
        >
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={draftFilters.sample_available === true}
                onChange={(e) =>
                  updateDraftFilters({ sample_available: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Sample Available</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={draftFilters.dropship_available === true}
                onChange={(e) =>
                  updateDraftFilters({ dropship_available: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">Dropship Available</span>
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Tags */}
      <Collapsible
        open={expandedSections.has("tags")}
        onOpenChange={() => toggleSection("tags")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <Tag className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            <span>Tags</span>
          </div>
          {expandedSections.has("tags") ? (
            <ChevronUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          ) : (
            <ChevronDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent
          className={compact ? "space-y-2 mt-2" : "space-y-3 mt-3"}
        >
          <div
            className={
              compact ? "flex flex-wrap gap-1.5" : "flex flex-wrap gap-2"
            }
          >
            {filterOptions?.availableTags.map((tag) => (
              <Badge
                key={tag.name}
                variant={
                  draftFilters.tags.includes(tag.name) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newTags = draftFilters.tags.includes(tag.name)
                    ? draftFilters.tags.filter((t) => t !== tag.name)
                    : [...draftFilters.tags, tag.name];
                  updateDraftFilters({ tags: newTags });
                }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible
        open={expandedSections.has("colors")}
        onOpenChange={() => toggleSection("colors")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <Palette className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            <span>Colors</span>
          </div>
          {expandedSections.has("colors") ? (
            <ChevronUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          ) : (
            <ChevronDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent
          className={compact ? "space-y-2 mt-2" : "space-y-3 mt-3"}
        >
          <div
            className={
              compact ? "flex flex-wrap gap-1.5" : "flex flex-wrap gap-2"
            }
          >
            {filterOptions?.availableColors.map((color) => (
              <Badge
                key={color.name}
                variant={
                  draftFilters.colors.includes(color.name)
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newColors = draftFilters.colors.includes(color.name)
                    ? draftFilters.colors.filter((c) => c !== color.name)
                    : [...draftFilters.colors, color.name];
                  updateDraftFilters({ colors: newColors });
                }}
              >
                {color.name}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Sizes */}
      <Collapsible
        open={expandedSections.has("sizes")}
        onOpenChange={() => toggleSection("sizes")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
          <div className="flex items-center gap-2">
            <Ruler className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
            <span>Sizes</span>
          </div>
          {expandedSections.has("sizes") ? (
            <ChevronUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          ) : (
            <ChevronDown className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent
          className={compact ? "space-y-2 mt-2" : "space-y-3 mt-3"}
        >
          <div
            className={
              compact ? "flex flex-wrap gap-1.5" : "flex flex-wrap gap-2"
            }
          >
            {filterOptions?.availableSizes.map((size) => (
              <Badge
                key={size.name}
                variant={
                  draftFilters.sizes.includes(size.name) ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => {
                  const newSizes = draftFilters.sizes.includes(size.name)
                    ? draftFilters.sizes.filter((s) => s !== size.name)
                    : [...draftFilters.sizes, size.name];
                  updateDraftFilters({ sizes: newSizes });
                }}
              >
                {size.name}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Action Buttons */}
      <div
        className={
          compact ? "flex gap-2 pt-3 border-t" : "flex gap-2 pt-4 border-t"
        }
      >
        <Button
          onClick={applyFilters}
          className={compact ? "flex-1 h-9 text-sm" : "flex-1"}
          disabled={isApplying}
        >
          {isApplying ? (
            <span className="inline-flex items-center gap-2">
              <Loader2
                className={
                  compact ? "h-3.5 w-3.5 animate-spin" : "h-4 w-4 animate-spin"
                }
              />
              Applying
            </span>
          ) : (
            "Apply Filters"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          className={compact ? "h-9 text-sm" : undefined}
        >
          Clear All
        </Button>
      </div>
    </div>
  );

  const activeFiltersCount = getActiveFiltersCount();

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          if (open) {
            setDraftFilters(filters);
          }
          setIsOpen(open);
        }}
      >
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between rounded-full px-4 py-2 border-muted-foreground/30 shadow-sm hover:shadow focus-visible:ring-2"
          >
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
          <DrawerHeader className="py-3">
            <DrawerTitle className="text-base">Filters</DrawerTitle>
          </DrawerHeader>
          <div className="max-h-[65vh] overflow-y-auto">
            <FilterContent compact />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setDraftFilters(filters);
        }
        setIsOpen(open);
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full px-4 py-2 border-muted-foreground/30 shadow-sm hover:shadow focus-visible:ring-2"
        >
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
