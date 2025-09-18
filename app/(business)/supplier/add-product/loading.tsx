import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12 mx-auto max-w-screen-2xl px-3 md:px-6">
      <div className="pt-2 md:pt-4">
        <Skeleton className="h-7 w-40 md:h-9 md:w-56" />
        <Skeleton className="h-4 w-56 md:w-80 mt-2" />
      </div>
      <div className="border-t" />

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-6 md:space-y-10">
            {/* Images Section */}
            <div className="space-y-3 md:space-y-4">
              <Skeleton className="h-5 w-28 md:h-6 md:w-40" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 md:p-4 bg-muted/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                    <Skeleton className="h-28 sm:h-32 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="space-y-3 md:space-y-4">
              <Skeleton className="h-5 w-32 md:h-6 md:w-44" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-3 md:space-y-4">
              <Skeleton className="h-5 w-28 md:h-6 md:w-36" />
              <div className="space-y-3 md:space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-3 md:p-4 bg-muted/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Loading;
