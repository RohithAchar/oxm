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

const LandingPage = async () => {
  return (
    <main className="space-y-24 lg:space-y-48 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <section className="max-w-7xl mx-auto md:mt-12 p-4">
        <Suspense fallback={<CustomCarousalSkeleton />}>
          <Carousal />
        </Suspense>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          <Link href={"/products"}>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>Explore</CardTitle>
                  <CardDescription className="hidden md:block">
                    Discover our complete product range.
                  </CardDescription>
                </div>
                <CardAction className="bg-primary/10 p-2 rounded-full">
                  <Package className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link href={"/supplier"}>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-1">
                  <CardTitle>My Box</CardTitle>
                  <CardDescription className="hidden md:block">
                    Manage your full business account here.
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
                  <CardTitle>Learn X</CardTitle>
                  <CardDescription className="hidden md:block">
                    Learn fresh skills and valuable insights.
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
                  <CardTitle>Dropship</CardTitle>
                  <CardDescription className="hidden md:block">
                    Begin your exciting dropshipping venture.
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

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="w-full">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-2">
              How OpenXmart works for you
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground text-center">
              A simple, transparent process designed to connect you with
              verified suppliers and quality products.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="relative rounded-xl border p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-background text-foreground border flex items-center justify-center font-bold shadow-md">
              1
            </div>
            <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Package className="w-5 h-5 text-primary" />
              Browse Products
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore products from verified Indian suppliers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-xl border p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-background text-foreground border flex items-center justify-center font-bold shadow-md">
              2
            </div>
            <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Order Samples
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Test product quality before bulk buying.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-xl border p-6 bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-background text-foreground border flex items-center justify-center font-bold shadow-md">
              3
            </div>
            <h3 className="mt-6 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Users className="w-5 h-5 text-primary" />
              Contact Suppliers
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Buy directly and build long-term partnerships.
            </p>
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
