import { Suspense } from "react";

import { Categories, CategorySkeletons } from "./categories";
import SearchBar from "./search-bar";
import {
  FeaturedProducts,
  FeaturedProductsSkeleton,
} from "./featured-products";

export const LandingPageLarge = async () => {
  return (
    <div className="mt-12 space-y-6">
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
  );
};
