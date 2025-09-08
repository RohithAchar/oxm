import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const ProductPageLoading = () => {
  return (
    <main className="mt-4 space-y-6 pb-24 md:pb-12 mx-auto max-w-7xl">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80 mt-2" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-8 lg:space-y-12">
            {/* Product Images Section */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-80 mt-2" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <Skeleton className="h-5 w-24" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-32 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-80 mt-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-80 mt-2" />
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-4 bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-6 w-6 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProductPageLoading;
