import { Suspense } from "react";

import { Categories, CategorySkeletons } from "./categories";
import SearchBar from "./search-bar";
import {
  FeaturedProducts,
  FeaturedProductsSkeleton,
} from "./featured-products";

export const LandingPageLarge = async () => {
  return (
    <>
      {/* Mobile View - Native App Style */}
      <div className="md:hidden">
        <div className="min-h-screen bg-background">
          {/* Hero Section - Mobile */}
          <section className="px-4 pt-6 pb-8 space-y-5 bg-gradient-to-b from-primary/5 via-primary/3 to-background">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight">
                NEW GEN B2B SOURCING PLATFORM
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Source from verified suppliers
              </p>
            </div>
            <div className="w-full">
              <SearchBar />
            </div>
          </section>

          {/* Products Section - Mobile */}
          <section className="px-0 py-6 bg-muted/30">
            <div className="px-4 mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Featured Products
              </h2>
            </div>
            <Suspense fallback={<FeaturedProductsSkeleton />}>
              <FeaturedProducts />
            </Suspense>
          </section>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block mt-12 space-y-6">
        <main className="pt-24 pb-12 space-y-4">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            NEW GEN B2B SOURCING PLATFORM
          </h1>
          <SearchBar />
        </main>
        <div className="w-full max-w-7xl mx-auto space-y-4 pb-24">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Categories
          </h3>
          <Suspense fallback={<CategorySkeletons />}>
            <Categories />
          </Suspense>
        </div>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </>
  );
};
