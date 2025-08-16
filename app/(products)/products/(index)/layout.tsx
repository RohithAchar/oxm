"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  SortSidebar,
  MobileSortButton,
  getSortDisplayLabel,
} from "@/components/product/sort-sidebar";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Sync with URL parameters
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    setCurrentSort(sortParam || "");
  }, [searchParams]);

  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue);

    // Update URL with new sort parameter
    const params = new URLSearchParams(searchParams);
    if (sortValue) {
      params.set("sort", sortValue);
    } else {
      params.delete("sort");
    }
    params.delete("page"); // Reset to first page when sorting changes

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto pb-24 md:pb-0 space-y-4">
      {/* Header with Sort and Filters */}
      <div className="bg-background fixed top-13 left-0 right-0 z-50 border-b">
        <div className="flex items-center justify-between p-4">
          {/* Left side - empty for now, can be used for other elements */}
          <div className="hidden md:block">
            {/* Space for potential left-side elements */}
          </div>

          {/* Mobile Sort Button */}
          <div className="md:hidden w-full">
            <MobileSortButton
              currentSort={currentSort}
              onOpenChange={setIsSortOpen}
            />
          </div>

          {/* Right side - Sort and Filters buttons grouped together */}
          <div className="hidden md:flex items-center gap-2">
            {/* Desktop Sort Button */}
            <Button
              variant="outline"
              onClick={() => setIsSortOpen(true)}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              {currentSort ? getSortDisplayLabel(currentSort) : "Sort Products"}
              {currentSort && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Active
                </Badge>
              )}
            </Button>

            {/* Filters Button */}
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Sort Sidebar */}
      <SortSidebar
        currentSort={currentSort}
        onSortChange={handleSortChange}
        isOpen={isSortOpen}
        onOpenChange={setIsSortOpen}
      />

      <main className="pt-24">{children}</main>
    </div>
  );
};

export default Layout;
