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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import RecentlyViewedList from "@/components/home/recently-viewed-list";
import Footer from "@/components/footer";
import {
  NewLaunchedItems,
  NewLaunchedItemsSkeleton,
} from "@/components/home/new-launched-list";

const NewLandingPage = async () => {
  return (
    <main className="space-y-10 lg:space-y-16 overflow-hidden">
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

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 pt-6 lg:pt-10">
        <div className="rounded-3xl border bg-white/90 dark:bg-background p-6 md:p-12 shadow">
          {/* subtle accent removed for cleaner light mode */}
          <div className="relative mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight text-foreground">
              Find Winning Products & Verified Suppliers
            </h1>
            <p className="text-base md:text-lg text-foreground/80">
              Source confidently from verified Indian suppliers. Samples to
              bulk, all in one place.
            </p>
            <div className="relative">
              <div className="flex items-center rounded-full border bg-background shadow-[0_8px_24px_rgba(239,68,68,0.06)] overflow-hidden">
                <div className="pl-4 pr-2 text-muted-foreground">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  className="w-full h-14 md:h-16 bg-transparent outline-none text-base md:text-lg placeholder:text-muted-foreground px-2"
                  placeholder="Search Winning Products & Verified Suppliers"
                  disabled
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-1"
                  aria-label="Image Search (coming soon)"
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <Button className="rounded-full mr-3">Search</Button>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                Recently searched: liphone, laubub water bottel, smart watches
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            {/* Explore - neutral card with emerald badge */}
            <Link href="/products">
              <div className="group rounded-2xl border bg-white dark:bg-card p-6 text-center hover:shadow-md transition">
                <div className="flex items-center justify-center gap-3 text-foreground">
                  <span className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-100 text-emerald-800">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="font-semibold">Explore Products</span>
                </div>
              </div>
            </Link>
            {/* Learn & Grow - indigo badge */}
            <Link href="/learn">
              <div className="group rounded-2xl border bg-white dark:bg-card p-6 text-center hover:shadow-md transition">
                <div className="flex items-center justify-center gap-3 text-foreground">
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
              <div className="rounded-2xl border  bg-white dark:bg-card p-6 text-center">
                <div className="flex items-center justify-center gap-3 text-foreground">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700">
                    <BadgeDot className="bg-amber-600" />
                  </span>
                  <span className="font-semibold">Markdown</span>
                </div>
              </div>
            </Link>
            {/* Dropship - orange badge */}
            <Link href="/products?dropship_available=true">
              <div className="group rounded-2xl border  bg-white dark:bg-card p-6 text-center hover:shadow-md transition">
                <div className="flex items-center justify-center gap-3 text-foreground">
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

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="w-full text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
            How OpenXmart works for you
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A simple, transparent process designed to connect you with verified
            suppliers and quality products.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Browse Products</CardTitle>
                  <CardDescription>
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
                  <CardTitle>Order Samples</CardTitle>
                  <CardDescription>
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
                  <CardTitle>Contact Suppliers</CardTitle>
                  <CardDescription>
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
                  <CardTitle>Buyer Protection</CardTitle>
                  <CardDescription>
                    Your money is safe until delivery is verified.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewedList />

      {/* New Arrivals */}
      <Suspense fallback={<NewLaunchedItemsSkeleton />}>
        <NewLaunchedItems />
      </Suspense>

      {/* Footer */}
      <Footer />
    </main>
  );
};

function BadgeDot({ className = "bg-yellow-500" }: { className?: string }) {
  return <span className={`inline-block w-5 h-5 rounded-full ${className}`} />;
}

export default NewLandingPage;
