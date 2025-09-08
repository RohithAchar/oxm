import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-16 mx-auto rounded-full" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>

          {/* Form Skeleton */}
          <div className="space-y-8">
            {/* Business Information Section */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Business Address Section */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            </div>

            {/* Business Type Section */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <div className="border-2 border-dashed border-muted-foreground rounded-lg p-6 text-center">
                      <Skeleton className="w-12 h-12 mx-auto mb-2" />
                      <Skeleton className="h-4 w-32 mx-auto" />
                      <Skeleton className="h-3 w-48 mx-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="flex justify-center">
              <Skeleton className="h-12 w-48 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
