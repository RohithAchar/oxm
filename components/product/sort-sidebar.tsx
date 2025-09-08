"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Clock,
  DollarSign,
  X,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
};

const sortOptions: SortOption[] = [
  {
    id: "newest",
    label: "Newest First",
    icon: <Clock className="w-4 h-4" />,
    value: "created_at_desc",
  },
  {
    id: "oldest",
    label: "Oldest First",
    icon: <Clock className="w-4 h-4" />,
    value: "created_at_asc",
  },
  {
    id: "price_low",
    label: "Price: Low to High",
    icon: <ArrowUp className="w-4 h-4" />,
    value: "price_asc",
  },
  {
    id: "price_high",
    label: "Price: High to Low",
    icon: <ArrowDown className="w-4 h-4" />,
    value: "price_desc",
  },
  {
    id: "name_asc",
    label: "Name: A to Z",
    icon: <ArrowUp className="w-4 h-4" />,
    value: "name_asc",
  },
  {
    id: "name_desc",
    label: "Name: Z to A",
    icon: <ArrowDown className="w-4 h-4" />,
    value: "name_desc",
  },
  {
    id: "verified",
    label: "Verified Suppliers First",
    icon: <Star className="w-4 h-4" />,
    value: "verified_desc",
  },
  {
    id: "popular",
    label: "Most Popular",
    icon: <Star className="w-4 h-4" />,
    value: "popular_desc",
  },
];

// Helper function to get sort option by value
export const getSortOptionByValue = (value: string): SortOption | undefined => {
  return sortOptions.find((option) => option.value === value);
};

// Helper function to get display label
export const getSortDisplayLabel = (value: string): string => {
  const option = getSortOptionByValue(value);
  return option ? option.label : "Sort Products";
};

interface SortSidebarProps {
  currentSort: string;
  onSortChange: (sortValue: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SortSidebar({
  currentSort,
  onSortChange,
  isOpen,
  onOpenChange,
}: SortSidebarProps) {
  const isMobile = useIsMobile();

  const handleSortChange = (sortValue: string) => {
    onSortChange(sortValue);
    if (isMobile) {
      onOpenChange(false);
    }
  };

  const SortContent = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        {sortOptions.map((option) => (
          <Button
            key={option.id}
            variant={currentSort === option.value ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-auto py-3 px-4",
              currentSort === option.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            )}
            onClick={() => handleSortChange(option.value)}
          >
            {option.icon}
            <span className="text-sm font-medium">{option.label}</span>
            {currentSort === option.value && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              </div>
            )}
          </Button>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSortChange("")}
        >
          <X className="w-4 h-4 mr-2" />
          Clear Sorting
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Sort Products
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <SortContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Sort Products
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <SortContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mobile Sort Button Component
export function MobileSortButton({
  currentSort,
  onOpenChange,
}: {
  currentSort: string;
  onOpenChange: (open: boolean) => void;
}) {
  const currentSortOption = getSortOptionByValue(currentSort);

  return (
    <Button
      variant="outline"
      className="w-full justify-between"
      onClick={() => onOpenChange(true)}
    >
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4" />
        <span className="text-sm">
          {currentSortOption ? currentSortOption.label : "Sort Products"}
        </span>
      </div>
      <Filter className="w-4 h-4" />
    </Button>
  );
}
