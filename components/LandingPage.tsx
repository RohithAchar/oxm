"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Package, Users, GraduationCap, Truck } from "lucide-react";

// Import your existing components
import RecentlyViewedList from "./recently-viewed-list";
import NewLaunchedItems from "./new-launched-list";
import { BannerCarousel } from "./banner-view";
import { Button } from "./ui/button";
import Link from "next/link";
import Footer from "./footer";

const LandingPage = ({ isLoggedIn = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        className={`px-6 md:px-12 py-12 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <BannerCarousel />
      </section>

      {/* Navigation Cards Section */}
      <section
        className={`px-6 md:px-12 py-20 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              How openxmart works for you
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
                <p className="text-gray-600">
                  Explore product from verified Indian supplier
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Order Samples</h3>
                <p className="text-gray-600">
                  Test product quality before bulk buying
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Contact Suppliers
                </h3>
                <p className="text-gray-600">
                  Buy directly and build long-term partnership
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-2 grid-cols-4">
            {navigationItems.map((item) => {
              return (
                <Button
                  className="py-8 px-2 lg:py-16 lg:px-6"
                  asChild
                  variant={"outline"}
                  key={item.title}
                >
                  <Link className="flex flex-col items-start" href={item.href}>
                    <div>
                      <item.icon size={32} />
                    </div>
                    {item.title}
                    <div>
                      <p className="hidden lg:block text-gray-600 mt-2 text-wrap">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Launches Section */}
      {/* <section
        className={`px-6 md:px-12 py-20 transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Latest Launches
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Discover what's new and exciting
            </p>
          </div> */}
      {/* <NewLaunchedItems /> */}
      {/* </div>
      </section> */}

      {/* Recently Viewed Section */}
      <RecentlyViewedList />

      {/* Footer CTA */}
      <Footer />
    </div>
  );
};

export default LandingPage;
