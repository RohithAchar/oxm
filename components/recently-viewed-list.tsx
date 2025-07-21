"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRecentlyViewedStore } from "@/stores/recently-viewed";

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

  if (recentProducts.length === 0) {
    return null;
  }

  console.log("recentProducts:", recentProducts);

  return (
    <div className={className}>
      <h3 className="text-lg font-medium mb-4">Recently Viewed</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="group h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100">
              <CardContent className="p-3 flex flex-col h-full">
                {/* Product Image */}
                <div className="relative aspect-square mb-3 bg-gray-50 rounded-lg overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2 mt-auto">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>

                  {product.brand && (
                    <p className="text-xs text-gray-500">{product.brand}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
