import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Fixed Search and Filter Bar Skeleton */}
      <div className="sticky top-14 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="space-y-4 py-4">
          {/* Filters button row */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-28 rounded-md bg-muted animate-pulse" />
            <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
          </div>

          {/* Active filters chips */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
          </div>

          {/* Results summary */}
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="aspect-square w-full rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex gap-2 mt-8 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-9 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
}


