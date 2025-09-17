import Link from "next/link";
import { Suspense } from "react";
import {
  Truck,
  Package,
  Handshake,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import ProductSearch from "@/components/search/ProductSearch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  NewLaunchedItems,
  NewLaunchedItemsSkeleton,
} from "@/components/home/new-launched-list";
import { Carousal } from "@/components/home/carousal";
import { CustomCarousalSkeleton } from "./custom-carousal";
import RecentlyViewedList from "@/components/recent/RecentlyViewedList";
import FavoritesSection from "@/components/home/favorites-section";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { P } from "@/components/ui/p";

const NewLandingPage = async () => {
  return (
    <main className="space-y-8 lg:space-y-12 overflow-hidden pb-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "OpenXmart",
            url: "https://openxmart.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://openxmart.com/products?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "OpenXmart",
            url: "https://openxmart.com",
            logo: "https://openxmart.com/image.jpeg",
            sameAs: [
              "https://www.linkedin.com/",
              "https://www.instagram.com/",
              "https://twitter.com/",
            ],
          }),
        }}
      />

      {/* Mobile-only layout */}
      <section className="md:hidden max-w-7xl mx-auto px-4 pt-4 space-y-4">
        {/* Custom Carousel */}
        <Suspense fallback={<CustomCarousalSkeleton />}>
          {/* Using existing carousal that renders CustomCarousal items */}
          <Carousal />
        </Suspense>

        {/* Horizontal pill nav (icons + text) */}
        <div className=" pl-4 pr-4 flex justify-start gap-2 overflow-x-auto no-scrollbar py-1 snap-x snap-mandatory">
          <Link href="/products">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background whitespace-nowrap text-sm shrink-0 snap-start">
              <Sparkles className="h-4 w-4" />
              <span>Explore</span>
            </div>
          </Link>
          <Link href="/intro">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background whitespace-nowrap text-sm shrink-0 snap-start">
              <Package className="h-4 w-4" />
              <span>MyBox</span>
            </div>
          </Link>
          <Link href="/learn">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background whitespace-nowrap text-sm shrink-0 snap-start">
              <GraduationCap className="h-4 w-4" />
              <span>Learn</span>
            </div>
          </Link>
          <Link href="/products?dropship_available=true">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background whitespace-nowrap text-sm shrink-0 snap-start">
              <Truck className="h-4 w-4" />
              <span>Dropship</span>
            </div>
          </Link>
        </div>

        {/* New Arrivals */}
        <div>
          <Suspense fallback={<NewLaunchedItemsSkeleton />}>
            <NewLaunchedItems />
          </Suspense>
        </div>
      </section>

      {/* Desktop / large-screen content */}
      <section className="hidden md:block relative max-w-7xl mx-auto px-4 pt-4 lg:pt-8">
        <div className="rounded-md border p-4 pt-8 md:p-12 shadow">
          <div className="relative mx-auto max-w-4xl text-center space-y-4 md:space-y-5">
            <H1 className="text-3xl md:text-6xl font-bold tracking-tight leading-tight text-foreground">
              Find Winning Products{" "}
              <span className="text-foreground/60 font-medium">
                &amp; Verified Suppliers
              </span>
            </H1>
            <P className="text-sm md:text-base lg:text-lg text-muted-foreground">
              Source confidently from verified Indian suppliers. Samples to
              bulk, all in one place.
            </P>
            <ProductSearch
              placeholder="Search Winning Products & Verified Suppliers"
              size="lg"
              rounded="full"
              className="mx-auto w-full max-w-4xl"
            />
            {/* Secondary actions in a single pill bar */}
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-full bg-muted/60 border border-muted/60 px-2 md:px-3 py-2">
                <div className="flex items-center justify-between gap-1">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm text-foreground hover:bg-transparent"
                  >
                    <Sparkles className="h-4 w-4 text-foreground/70" />
                    <span>Explore Products</span>
                  </Link>
                  <Link
                    href="/learn"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm text-foreground hover:bg-transparent"
                  >
                    <GraduationCap className="h-4 w-4 text-foreground/70" />
                    <span>Learn & Grow</span>
                  </Link>
                  <Link
                    href="#"
                    aria-disabled
                    className="pointer-events-none opacity-70 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm text-foreground"
                  >
                    <BadgeDot className="h-2.5 w-2.5 bg-amber-600 rounded-full" />
                    <span>Markdown</span>
                  </Link>
                  <Link
                    href="/products?dropship_available=true"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm text-foreground hover:bg-transparent"
                  >
                    <Truck className="h-4 w-4 text-foreground/70" />
                    <span>Dropship Ready</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (desktop only) */}
      <section className="hidden md:block max-w-7xl mx-auto px-4 mt-16 lg:mt-24">
        <div className="w-full text-center mb-8">
          <H2 className="text-lg sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
            How OpenXmart works for you
          </H2>
          <P className="text-sm sm:text-base text-muted-foreground">
            A simple, transparent process designed to connect you with verified
            suppliers and quality products.
          </P>
        </div>
        {/* Mobile horizontal scroller */}
        <div
          className="md:hidden -ml-4 px-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-3 snap-x snap-mandatory">
            <div className="min-w-[80%] snap-start">
              <Card className="group hover:shadow-md transition">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Sparkles className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                    <CardTitle className="text-base md:text-lg line-clamp-2">
                      Browse Products
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm line-clamp-2">
                      Explore products from verified Indian suppliers.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="min-w-[80%] snap-start">
              <Card className="group hover:shadow-md transition">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Package className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                    <CardTitle className="text-base md:text-lg line-clamp-2">
                      Order Samples
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm line-clamp-2">
                      Test product quality before bulk buying.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="min-w-[80%] snap-start">
              <Card className="group hover:shadow-md transition">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Handshake className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                    <CardTitle className="text-base md:text-lg line-clamp-2">
                      Contact Suppliers
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm line-clamp-2">
                      Buy directly and build long-term partnerships.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="min-w-[80%] snap-start">
              <Card className="group hover:shadow-md transition">
                <CardHeader className="p-3 sm:p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <ShieldCheck className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                    <CardTitle className="text-base md:text-lg line-clamp-2">
                      Buyer Protection
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm line-clamp-2">
                      Your money is safe until delivery is verified.
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        {/* Desktop/grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
          <Card className="group hover:shadow-md transition">
            <CardHeader className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <Sparkles className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                <CardTitle className="text-base md:text-lg line-clamp-2">
                  Browse Products
                </CardTitle>
                <CardDescription className="text-xs md:text-sm line-clamp-2">
                  Explore products from verified Indian suppliers.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="group hover:shadow-md transition">
            <CardHeader className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <Package className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                <CardTitle className="text-base md:text-lg line-clamp-2">
                  Order Samples
                </CardTitle>
                <CardDescription className="text-xs md:text-sm line-clamp-2">
                  Test product quality before bulk buying.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="group hover:shadow-md transition">
            <CardHeader className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <Handshake className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                <CardTitle className="text-base md:text-lg line-clamp-2">
                  Contact Suppliers
                </CardTitle>
                <CardDescription className="text-xs md:text-sm line-clamp-2">
                  Buy directly and build long-term partnerships.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <Card className="group hover:shadow-md transition">
            <CardHeader className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="h-7 w-7 text-foreground/70 transition-colors group-hover:text-primary" />
                <CardTitle className="text-base md:text-lg line-clamp-2">
                  Buyer Protection
                </CardTitle>
                <CardDescription className="text-xs md:text-sm line-clamp-2">
                  Your money is safe until delivery is verified.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Recently Viewed and New Arrivals already shown on mobile above.
          Show them here as well for desktop. */}
      <div className="hidden md:block">
        <Suspense fallback={<NewLaunchedItemsSkeleton />}>
          <NewLaunchedItems />
        </Suspense>
      </div>

      {/* Recently viewed (bottom of page) */}
      <RecentlyViewedList />

      {/* Favorites section */}
      <FavoritesSection />

      {/* Footer is rendered globally via layout */}
    </main>
  );
};

function BadgeDot({ className = "bg-yellow-500" }: { className?: string }) {
  return <span className={`inline-block w-5 h-5 rounded-full ${className}`} />;
}

export default NewLandingPage;
