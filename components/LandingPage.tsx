"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Package, Users, GraduationCap, Truck } from "lucide-react";

// Import your existing components
import RecentlyViewedList from "./recently-viewed-list";
import NewLaunchedItems from "./new-launched-list";
import { BannerCarousel } from "./banner-view";

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
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Explore Our Platform
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 font-light">
            Everything you need, beautifully integrated
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {navigationItems.map((item, index) => (
              <div
                key={item.title}
                className={`cursor-pointer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="relative overflow-hidden rounded-3xl p-8 h-80 flex flex-col justify-between bg-white border border-gray-100">
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.gradient} flex items-center justify-center mb-6`}
                    >
                      <item.icon size={32} className="text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{item.description}</p>
                  </div>

                  <div className="relative z-10 flex items-center text-gray-400">
                    <span className="text-sm font-medium mr-2">Learn more</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      <section
        className={`px-6 md:px-12 py-20 bg-gradient-to-r from-gray-50 to-white transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Recently Viewed
              </h2>
              <p className="text-gray-600 font-light">
                Pick up where you left off
              </p>
            </div>
            <button className="flex items-center text-blue-600 font-medium">
              View All
              <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
          <RecentlyViewedList />
        </div>
      </section>

      {/* New Launches Section */}
      <section
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
          </div>
          <NewLaunchedItems />
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className={`px-6 md:px-12 py-20 transition-all duration-1000 delay-900 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 font-light">
                Join thousands of users who trust our platform
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold text-lg">
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
