import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Variants Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-10 rounded-md" />
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-20" />
              <div className="flex items-center gap-2">
                <Skeleton className="w-10 h-10 rounded-md" />
                <Skeleton className="w-16 h-10" />
                <Skeleton className="w-10 h-10 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
