import { Suspense } from "react";
import { CustomCarousalSkeleton } from "./custom-carousal";
import { Carousal } from "./carousal";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  ChevronRight,
  GraduationCap,
  Package,
  Store,
  Truck,
} from "lucide-react";
import { MobileLatestList, ProductCardSkeleton } from "./MobileLatestList";
import { CategoryCardSkeleton, MobileCategoryList } from "./MobileCategoryList";
import {
  NewLaunchedItems,
  NewLaunchedItemsSkeleton,
} from "./new-launched-list";
import {
  JustForYouProductList,
  JustForYouProductListSkeleton,
} from "./JustForYouProductsList";
import JustForYouInfinite from "./JustForYouInfinite";
import { Skeleton } from "../ui/skeleton";

export const MobileLandingPage = () => {
  return (
    <section className="md:hidden max-w-7xl mx-auto pt-4 space-y-4">
      {/* Custom Carousel */}
      <Suspense fallback={<CustomCarousalSkeleton />}>
        {/* Using existing carousal that renders CustomCarousal items */}
        <Carousal />
      </Suspense>

      {/* Navigations */}
      <nav className="grid grid-cols-4">
        <Link
          href={"/products"}
          className="cursor-pointer flex flex-col items-center gap-1"
        >
          <span className="bg-primary-foreground p-2 rounded-full">
            <Store width={36} height={36} stroke="red" strokeWidth={1} />
          </span>
          <span className="font-bold text-sm">Explore</span>
        </Link>
        <Link
          href={"/intro"}
          className="cursor-pointer flex flex-col items-center gap-1"
        >
          <span className="bg-primary-foreground p-2 rounded-full">
            <Package width={36} height={36} stroke="red" strokeWidth={1} />
          </span>
          <span className="font-bold text-sm">MyBox</span>
        </Link>
        <Link
          href={"/learn"}
          className="cursor-pointer flex flex-col items-center gap-1"
        >
          <span className="bg-primary-foreground p-2 rounded-full">
            <GraduationCap
              width={36}
              height={36}
              stroke="red"
              strokeWidth={1}
            />
          </span>
          <span className="font-bold text-sm">Learn</span>
        </Link>
        <Link
          href={"/products?dropship_available=true"}
          className="cursor-pointer flex flex-col items-center gap-1"
        >
          <span className="bg-primary-foreground p-2 rounded-full">
            <Truck width={36} height={36} stroke="red" strokeWidth={1} />
          </span>
          <span className="font-bold text-sm">Dropship</span>
        </Link>
      </nav>

      {/* Latest launches */}
      <div className="py-2 space-y-2">
        <div className="flex justify-between">
          <h2 className="font-bold text-base">Latest Launches</h2>
          <Link
            className="flex gap-1 items-center underline text-sm"
            href={"/products"}
          >
            more <ChevronRight className="w-4 h-4 opacity-70" />
          </Link>
        </div>
        <Suspense fallback={<ProductCardSkeleton />}>
          <MobileLatestList />
        </Suspense>
      </div>

      {/* Categories */}
      <div className="py-2 space-y-2">
        <div className="flex justify-between">
          <h2 className="font-bold text-base">Categories</h2>
          <Link
            className="flex gap-1 items-center underline text-sm"
            href={"/products"}
          >
            more <ChevronRight className="w-4 h-4 opacity-70" />
          </Link>
        </div>
        <Suspense fallback={<CategoryCardSkeleton />}>
          <MobileCategoryList />
        </Suspense>
      </div>

      {/* Banner */}
      <div className="h-[100px] w-full rounded-lg bg-muted flex items-center justify-center">
        Image or some graphics here
      </div>

      {/* Products list */}
      <div className="py-2 space-y-2">
        <div className="flex justify-between">
          <h2 className="font-bold text-base">Just for you</h2>
          <Link
            className="flex gap-1 items-center underline text-sm"
            href={"/products"}
          >
            more <ChevronRight className="w-4 h-4 opacity-70" />
          </Link>
        </div>
        <Suspense fallback={<JustForYouProductListSkeleton />}>
          <JustForYouInfinite />
        </Suspense>
      </div>
    </section>
  );
};
