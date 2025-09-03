import {
  NewLaunchedItems,
  NewLaunchedItemsSkeleton,
} from "./new-launched-list";
import Footer from "../footer";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ClipboardCheck,
  GraduationCap,
  Package,
  Truck,
  Users,
} from "lucide-react";
import RecentlyViewedList from "./recently-viewed-list";
import { Carousal } from "./carousal";
import { Suspense } from "react";
import { CustomCarousalSkeleton } from "./custom-carousal";
import { Button } from "../ui/button";

const LandingPage = async () => {
  return (
    <main className="space-y-12 lg:space-y-24 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
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
      <section className="animate-blurred-fade-in animate-duration-500 relative overflow-hidden max-w-7xl mx-auto px-4 text-center flex flex-col items-center justify-center min-h-[70vh] md:min-h-[75vh]">
        {/* Enhanced radial gradient - using shadcn colors */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 h-[680px] w-[680px] md:h-[880px] md:w-[880px] rounded-full bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary))_0%,_hsl(var(--primary))/0.08_35%,_transparent_70%)] opacity-15" />
        {/* Enhanced outer ring for depth */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 h-[1000px] w-[1000px] md:h-[1200px] md:w-[1200px] rounded-full bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary))/0.05_0%,_transparent_60%)]" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          India's Premier <span className="text-primary">B2B Marketplace</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
          Connect with verified suppliers and buyers. Whether you're sourcing products or expanding your reach, OpenXmart is your trusted partner.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products">
            <Button size="lg" className="px-8">Browse Products</Button>
          </Link>
          <Link href="/intro">
            <Button variant="outline" size="lg" className="px-8">Become a Supplier</Button>
          </Link>
        </div>
      </section>
      <section className="max-w-7xl mx-auto md:mt-6 p-4">
        <Suspense fallback={<CustomCarousalSkeleton />}>
          <Carousal />
        </Suspense>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          <Link href={"/products"}>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Browse Products</CardTitle>
                  <CardDescription className="hidden md:block">
                    Find verified suppliers and quality products
                  </CardDescription>
                </div>
                <CardAction className="bg-primary/10 p-2 rounded-full">
                  <Package className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link href={"/intro"}>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Become a Supplier</CardTitle>
                  <CardDescription className="hidden md:block">
                    List your products and reach thousands of buyers
                  </CardDescription>
                </div>
                <CardAction className="bg-primary/10 p-2 rounded-full">
                  <Users className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link href={"/learn"}>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Learn & Grow</CardTitle>
                  <CardDescription className="hidden md:block">
                    Business insights and skills for success
                  </CardDescription>
                </div>
                <CardAction className="bg-primary/10 p-2 rounded-full">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link href={"/products?dropship_available=true"}>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Start Dropshipping</CardTitle>
                  <CardDescription className="hidden md:block">
                    Launch your dropshipping business today
                  </CardDescription>
                </div>
                <CardAction className="bg-primary/10 p-2 rounded-full">
                  <Truck className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-semibold text-center mb-8">How can we help you today?</h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/products" className="block">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">I'm a Buyer</h3>
              <p className="text-muted-foreground mb-3">
                Looking for quality products from verified suppliers
              </p>
              <Button variant="outline" className="w-full">Browse Products</Button>
            </Link>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/intro" className="block">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">I'm a Supplier</h3>
              <p className="text-muted-foreground mb-3">
                Want to list products and reach thousands of buyers
              </p>
              <Button className="w-full">Start Selling</Button>
            </Link>
          </Card>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="w-full">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">How OpenXmart Works</h2>
            <p className="text-sm sm:text-base text-muted-foreground text-center">Simple, transparent process for both buyers and suppliers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Buyer Journey */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center text-primary">For Buyers</h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

              <div className="relative mb-4 last:mb-0">
                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Browse Products</h4>
                      <p className="text-sm text-muted-foreground">Explore verified products from trusted suppliers</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mb-4 last:mb-0">
                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Order Samples</h4>
                      <p className="text-sm text-muted-foreground">Test quality before bulk purchasing</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mb-0">
                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Connect & Buy</h4>
                      <p className="text-sm text-muted-foreground">Build partnerships with suppliers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Journey */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-center text-primary">For Suppliers</h3>
            <div className="relative pl-6">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />

              <div className="relative mb-4 last:mb-0">
                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Register & Verify</h4>
                      <p className="text-sm text-muted-foreground">Complete business verification process</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mb-4 last:mb-0">
                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">List Products</h4>
                      <p className="text-sm text-muted-foreground">Upload your product catalog for free</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mb-0">
                <div className="absolute -left-2 top-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                <div className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Get Buy Leads</h4>
                      <p className="text-sm text-muted-foreground">Receive inquiries from serious buyers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<NewLaunchedItemsSkeleton />}>
        <NewLaunchedItems />
      </Suspense>

      <RecentlyViewedList />
      <Footer />
    </main>
  );
};

export default LandingPage;