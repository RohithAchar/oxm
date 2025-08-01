"use client";

import { Skeleton } from "../ui/skeleton";

export const BannerViewSkeleton = () => {
  return <Skeleton className="w-full aspect-video rounded-xl" />;
};

export const ProductCardSkeleton = () => {
  return (
    <section
      className={`px-4 sm:px-6 md:px-12 py-8 md:py-20 transition-all duration-1000 delay-700`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-6">
          <Skeleton className="mx-auto w-2/3 h-8" />
          <Skeleton className="mx-auto w-1/3 h-6" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {Array.from({ length: 6 }).map((products, id) => (
            <div
              key={id}
              className="shadow-sm p-2 pb-4 border rounded-xl bg-card space-y-4 h-fit"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <Skeleton className="h-60 object-cover rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="space-y-2">
                  <Skeleton className="w-2/3 h-4" />
                  <Skeleton className="w-2/3 h-3" />
                </div>

                <div className="space-y-2" key={id}>
                  <Skeleton className="w-full h-3" />
                  <Skeleton className="w-full h-3" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
