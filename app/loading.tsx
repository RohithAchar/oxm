import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section Skeleton */}
      <section className="relative px-4 sm:px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <Skeleton className="mx-auto w-2/3 h-12" />
          <Skeleton className="mx-auto w-1/2 h-6" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-12 w-32 rounded-lg" />
            <Skeleton className="h-12 w-32 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Banner Section Skeleton */}
      <section className="px-4 sm:px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="w-full aspect-video rounded-xl" />
        </div>
      </section>

      {/* Categories Section Skeleton */}
      <section className="px-4 sm:px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Skeleton className="mx-auto w-1/3 h-8" />
            <Skeleton className="mx-auto w-1/2 h-6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center space-y-3">
                <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section Skeleton */}
      <section className="px-4 sm:px-6 md:px-12 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Skeleton className="mx-auto w-1/3 h-8" />
            <Skeleton className="mx-auto w-1/2 h-6" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className="px-4 sm:px-6 md:px-12 py-16 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="mx-auto w-16 h-16 rounded-full" />
                <Skeleton className="h-6 w-24 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Loading;
