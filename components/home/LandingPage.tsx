import NewLaunchedItems from "./new-launched-list";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { CustomCarousal } from "./custom-carousal";
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
import { getBanners } from "@/lib/controller/home/banner";
import { getCurrentDateAndTime } from "@/utils/static";

const LandingPage = async () => {
  const banners = await getBanners();
  const currentDateAndTime = getCurrentDateAndTime();

  // Ensure we're working with a proper Date object in UTC
  const now = new Date(); // Use system time for consistency with UTC banner times

  let activeBanners = banners.filter((banner) => {
    const isActive = banner.is_active;

    // Convert banner dates to Date objects for comparison
    const startDate = banner.start_at ? new Date(banner.start_at) : null;
    const endDate = banner.end_at ? new Date(banner.end_at) : null;

    const isInDateRange =
      (!startDate || startDate <= now) && (!endDate || endDate >= now);

    return isActive && isInDateRange && banner.image_url;
  });

  if (activeBanners.length === 0) {
    activeBanners = [];
    activeBanners.push({
      alt_text: "Banner Image",
      click_count: 0,
      computed_ctr: 0,
      created_at: currentDateAndTime,
      end_at: currentDateAndTime,
      id: "1",
      image_url: "/image.jpeg",
      impression_count: 0,
      is_active: true,
      link_url: "/",
      start_at: currentDateAndTime,
      title: "Welcome to OpenXmart",
      updated_at: currentDateAndTime,
    });
  }

  return (
    <main className="space-y-24 lg:space-y-48 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <section className="max-w-7xl mx-auto md:mt-12 p-4">
        <Carousel>
          <CarouselContent>
            {activeBanners.map((banner) => (
              <CustomCarousal
                key={banner.id}
                id={banner.id}
                link_url={banner.link_url || "/"}
                image_url={banner.image_url}
                title={banner.title}
              />
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:block" />
          <CarouselNext className="hidden md:block" />
        </Carousel>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          <Link href={"/products"}>
            <Card>
              <CardHeader>
                <CardTitle>Explore</CardTitle>
                <CardDescription className="hidden md:block">
                  Discover our complete product range.
                </CardDescription>
                <CardAction>
                  <Package className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
          <Link href={"/supplier"}>
            <Card>
              <CardHeader>
                <CardTitle>My Box</CardTitle>
                <CardDescription className="hidden md:block">
                  Manage your full business account here.
                </CardDescription>
                <CardAction>
                  <Users className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
          <Link href={"/learn"}>
            <Card>
              <CardHeader>
                <CardTitle>Learn X</CardTitle>
                <CardDescription className="hidden md:block">
                  Learn fresh skills and valuable insights.
                </CardDescription>
                <CardAction>
                  <GraduationCap className="w-5 h-5 text-primary" />
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
          <Link href={"/products?dropship_available=true"}>
            <Card>
              <CardHeader>
                <CardTitle>Dropship</CardTitle>
                <CardDescription className="hidden md:block">
                  Begin your exciting dropshipping venture.
                </CardDescription>
                <CardAction>
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
            <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
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
            <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
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
            <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-md">
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

      <NewLaunchedItems />
      <RecentlyViewedList />
      <Footer />
    </main>
  );
};

export default LandingPage;
