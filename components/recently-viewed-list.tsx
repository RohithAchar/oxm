"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRecentlyViewedStore } from "@/stores/recently-viewed";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface RecentlyViewedListProps {
  limit?: number;
  className?: string;
}

export default function RecentlyViewedList({
  limit = 5,
  className,
}: RecentlyViewedListProps) {
  const getRecentProducts = useRecentlyViewedStore(
    (state) => state.getRecentProducts
  );
  const recentProducts = getRecentProducts(limit);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section
      className={`px-4 sm:px-6 md:px-12 py-8 md:py-16 bg-white transition-all duration-1000 delay-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-2">
              Recently Viewed
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-light">
              Pick up where you left off
            </p>
          </div>
          <button className="flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200">
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden text-sm">All</span>
            <ArrowRight size={16} className="ml-1 sm:ml-2 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {recentProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200 hover:border-gray-300">
                <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1 sm:space-y-2 mt-auto">
                    <h4 className="font-medium text-xs sm:text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                      {product.name}
                    </h4>

                    {product.brand && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {product.brand}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
