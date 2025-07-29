import { Suspense } from "react";
import { ArrowRight, Package, Users, GraduationCap, Truck } from "lucide-react";

// Import your existing components
import RecentlyViewedList from "./recently-viewed-list";
import NewLaunchedItems from "./new-launched-list";
import { BannerCarousel } from "./banner-view";
import { Button } from "./ui/button";
import Link from "next/link";
import Footer from "./footer";
import { BannerViewSkeleton } from "./skeleton/banner-view-skeleton";

const LandingPage = ({ isLoggedIn = false }) => {
  const navigationItems = [
    {
      title: "Explore",
      description: "Discover our complete product range",
      icon: Package,
      href: "/products",
      gradient: "from-blue-500 to-cyan-400",
      hoverGradient: "from-blue-600 to-cyan-500",
    },
    {
      title: "My Box",
      description: "Connect with trusted suppliers",
      icon: Users,
      href: "/supplier",
      gradient: "from-purple-500 to-pink-400",
      hoverGradient: "from-purple-600 to-pink-500",
    },
    {
      title: "Learn X",
      description: "Master new skills and insights",
      icon: GraduationCap,
      href: "/learn",
      gradient: "from-green-500 to-emerald-400",
      hoverGradient: "from-green-600 to-emerald-500",
    },
    {
      title: "Dropship",
      description: "Start your dropshipping journey",
      icon: Truck,
      href: "/dropship",
      gradient: "from-orange-500 to-red-400",
      hoverGradient: "from-orange-600 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Carousel Section */}
      <section
        className={`px-4 sm:px-6 md:px-12 py-8 md:py-12 transition-all duration-1000 delay-200`}
      >
        <Suspense fallback={<BannerViewSkeleton />}>
          <BannerCarousel />
        </Suspense>
      </section>
      {/* SEO Hero Section */}
      <section
        className={`sr-only px-4 sm:px-6 md:px-12 py-8 md:py-12 opacity-0`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            BUY SAMPLES & BULK PRODUCTS FROM VERIFIED SUPPLIERS | OPENXMART B2B
            INDIA
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Avoid scams, OpenXmart helps you buy product samples and bulk
            directly from verified Indian suppliers. Trusted by ecom sellers,
            dropshippers, retailers and d2c brands.
          </p>
        </div>
      </section>
      {/* Navigation Cards Section */}
      <section
        className={`px-4 sm:px-6 md:px-12 py-8 md:py-16 transition-all duration-1000 delay-400`}
      >
        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
          {navigationItems.map((item) => {
            return (
              <Button
                className="px-3 pt-4 lg:py-4 sm:px-4  lg:px-6 h-auto"
                asChild
                variant={"outline"}
                key={item.title}
              >
                <Link
                  className="flex flex-col items-center sm:items-start text-center sm:text-left"
                  href={item.href}
                >
                  <div className="mb-2">
                    <item.icon size={24} className="sm:w-8 sm:h-8" />
                  </div>
                  <span className="text-sm sm:text-base font-medium mb-1">
                    {item.title}
                  </span>
                  <div>
                    <p className="hidden lg:block text-gray-600 text-sm text-wrap">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>
      </section>
      {/* How it Works Section */}
      <section
        className={`px-4 sm:px-6 md:px-12 py-8 md:py-16 transition-all duration-1000 delay-600`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-center mb-6 md:mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              How openxmart works for you
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-light mb-2">
                  Browse Products
                </h3>
                <p className="text-gray-600 font-light text-sm sm:text-base">
                  Explore product from verified Indian supplier
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-light mb-2">
                  Order Samples
                </h3>
                <p className="text-gray-600 font-light text-sm sm:text-base">
                  Test product quality before bulk buying
                </p>
              </div>
              <div className="text-center sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-light mb-2">
                  Contact Suppliers
                </h3>
                <p className="text-gray-600 font-light text-sm sm:text-base">
                  Buy directly and build long-term partnership
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Launches Section */}
      <section
        className={`px-4 sm:px-6 md:px-12 py-8 md:py-20 transition-all duration-1000 delay-700`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Latest Launches
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Discover what's new and exciting
            </p>
          </div>
          <NewLaunchedItems />
        </div>
      </section>
      {/* Recently Viewed Section */}
      <RecentlyViewedList />
      {/* Footer CTA */}
      <Footer />
    </div>
  );
};

export default LandingPage;
