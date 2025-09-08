import Link from "next/link";
import { Suspense } from "react";
import {
  Truck,
  Search,
  Camera,
  Package,
  Handshake,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import RecentlyViewedList from "@/components/home/recently-viewed-list";
import {
  NewLaunchedItems,
  NewLaunchedItemsSkeleton,
} from "@/components/home/new-launched-list";
import { Carousal } from "@/components/home/carousal";
import { CustomCarousalSkeleton } from "./custom-carousal";

const NewLandingPage = async () => {
  return (
    <main className="space-y-10 lg:space-y-16 overflow-hidden pb-16">
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
      <section className="md:hidden max-w-7xl mx-auto px-4 pt-2 space-y-4">
        {/* Header: Logo, Search, Notification */}
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-xl leading-none">
            <span className="text-foreground">Open</span>
            <span className="text-primary">X</span>
            <span className="text-foreground">mart</span>
          </Link>
          <div className="flex-1">
            <div className="flex items-center rounded-full border bg-background overflow-hidden h-10">
              <div className="pl-3 pr-2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <input
                className="w-full h-full bg-transparent outline-none text-sm placeholder:text-muted-foreground px-1"
                placeholder="Search products & suppliers"
                disabled
              />
              <Link
                href="/products"
                className="pr-3 pl-2 text-sm text-primary font-medium"
              >
                Search
              </Link>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Custom Carousel */}
        <Suspense fallback={<CustomCarousalSkeleton />}>
          {/* Using existing carousal that renders CustomCarousal items */}
          <Carousal />
        </Suspense>

        {/* Horizontal pill nav */}
        <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          <Link href="/products">
            <div className="px-4 py-2 rounded-full border bg-background whitespace-nowrap text-sm">
              Explore
            </div>
          </Link>
          <Link href="/intro">
            <div className="px-4 py-2 rounded-full border bg-background whitespace-nowrap text-sm">
              MyBox
            </div>
          </Link>
          <Link href="/learn">
            <div className="px-4 py-2 rounded-full border bg-background whitespace-nowrap text-sm">
              Learnx
            </div>
          </Link>
          <Link href="/products?dropship_available=true">
            <div className="px-4 py-2 rounded-full border bg-background whitespace-nowrap text-sm">
              Dropship
            </div>
          </Link>
        </div>

        {/* New Arrivals */}
        <div>
          <Suspense fallback={<NewLaunchedItemsSkeleton />}>
            <NewLaunchedItems />
          </Suspense>
        </div>

        {/* Recently Viewed */}
        <RecentlyViewedList />
      </section>

      {/* Desktop / large-screen content */}
      <section className="hidden md:block relative max-w-7xl mx-auto px-4 pt-4 lg:pt-10">
        <div className="rounded-3xl border p-4 pt-8 md:p-12 shadow">
          {/* subtle accent removed for cleaner light mode */}
          <div className="relative mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-2xl md:text-6xl font-semibold tracking-tight leading-tight text-foreground">
              Find Winning Products & Verified Suppliers
            </h1>
            <p className="text-sm md:text-lg text-foreground/80">
              Source confidently from verified Indian suppliers. Samples to
              bulk, all in one place.
            </p>
            <div className="relative">
              <div className="flex items-center rounded-full border bg-background shadow-[0_8px_24px_rgba(239,68,68,0.06)] overflow-hidden">
                <div className="pl-4 pr-2 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="w-full h-12 md:h-16 bg-transparent outline-none text-sm md:text-lg placeholder:text-muted-foreground px-2"
                  placeholder="Search Winning Products & Verified Suppliers"
                  disabled
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1 hidden sm:inline-flex"
                  aria-label="Image Search (coming soon)"
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <Button className="rounded-full mr-3">Search</Button>
              </div>
              <p className="text-[11px] md:text-sm text-muted-foreground mt-2">
                Recently searched: liphone, laubub water bottel, smart watches
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            {/* Explore - neutral card with emerald badge */}
            <Link href="/products">
              <div className="group rounded-2xl border border-primary/40 bg-primary/5 ring-1 ring-primary/10 p-4 sm:p-6 hover:shadow-md transition">
                <div className="flex items-center justify-start gap-3 text-foreground">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-800">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="font-semibold">Explore Products</span>
                </div>
              </div>
            </Link>
            {/* Learn & Grow - indigo badge */}
            <Link href="/learn">
              <div className="group rounded-2xl border p-4 sm:p-6 hover:shadow-md transition">
                <div className="flex items-center justify-start gap-3 text-foreground">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <span className="font-semibold">Learn & Grow</span>
                </div>
              </div>
            </Link>
            {/* Markdown - amber badge */}
            <Link
              href="#"
              aria-disabled
              className="pointer-events-none opacity-70"
            >
              <div className="rounded-2xl border p-4 sm:p-6">
                <div className="flex items-center justify-start gap-3 text-foreground">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700">
                    <BadgeDot className="bg-amber-600" />
                  </span>
                  <span className="font-semibold">Markdown</span>
                </div>
              </div>
            </Link>
            {/* Dropship - orange badge */}
            <Link href="/products?dropship_available=true">
              <div className="group rounded-2xl border p-4 sm:p-6 hover:shadow-md transition">
                <div className="flex items-center justify-start gap-3 text-foreground">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-700">
                    <Truck className="h-4 w-4" />
                  </span>
                  <span className="font-semibold">Dropship Ready</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works (desktop only) */}
      <section className="hidden md:block max-w-7xl mx-auto px-4">
        <div className="w-full text-center mb-8">
          <h2 className="text-lg sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
            How OpenXmart works for you
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A simple, transparent process designed to connect you with verified
            suppliers and quality products.
          </p>
        </div>
        {/* Mobile horizontal scroller */}
        <div
          className="md:hidden -ml-4 px-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-3 snap-x snap-mandatory">
            <div className="min-w-[80%] snap-start">
              <Card className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">
                        Browse Products
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Explore products from verified Indian suppliers.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="min-w-[80%] snap-start">
              <Card className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">
                        Order Samples
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Test product quality before bulk buying.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="min-w-[80%] snap-start">
              <Card className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Handshake className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">
                        Contact Suppliers
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Buy directly and build long-term partnerships.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
            <div className="min-w-[80%] snap-start">
              <Card className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">
                        Buyer Protection
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Your money is safe until delivery is verified.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        {/* Desktop/grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg">
                    Browse Products
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Explore products from verified Indian suppliers.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg">
                    Order Samples
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Test product quality before bulk buying.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Handshake className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg">
                    Contact Suppliers
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Buy directly and build long-term partnerships.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base md:text-lg">
                    Buyer Protection
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Your money is safe until delivery is verified.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Recently Viewed and New Arrivals already shown on mobile above.
          Show them here as well for desktop. */}
      <div className="hidden md:block">
        <RecentlyViewedList />
        <Suspense fallback={<NewLaunchedItemsSkeleton />}>
          <NewLaunchedItems />
        </Suspense>
      </div>

      {/* Footer is rendered globally via layout */}
    </main>
  );
};

function BadgeDot({ className = "bg-yellow-500" }: { className?: string }) {
  return <span className={`inline-block w-5 h-5 rounded-full ${className}`} />;
}

export default NewLandingPage;
