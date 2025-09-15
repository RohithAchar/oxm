"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  MessageCircle,
  CheckCircle,
  Heart,
  Package,
  Calendar,
} from "lucide-react";
import { useFavoriteSuppliers } from "@/lib/contexts/favorite-suppliers-context";

interface Supplier {
  id: string;
  business_name: string;
  profile_avatar_url?: string | null;
  city?: string;
  state?: string;
  is_verified?: boolean | null;
  profile_id: string | null;
  created_at?: string | null;
  total_products?: number;
  business_type?: string;
}

interface FeaturedSuppliersProps {
  suppliers: Supplier[];
}

export default function FeaturedSuppliers({
  suppliers,
}: FeaturedSuppliersProps) {
  const {
    addToFavoriteSuppliers,
    removeFromFavoriteSuppliers,
    isFavoriteSupplier,
  } = useFavoriteSuppliers();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (suppliers.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Featured Suppliers
          </h2>
          <p className="text-muted-foreground">
            Connect with verified suppliers and discover quality products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {suppliers.map((supplier) => {
            const businessAge = supplier.created_at
              ? Math.floor(
                  (new Date().getTime() -
                    new Date(supplier.created_at).getTime()) /
                    (1000 * 60 * 60 * 24 * 365)
                )
              : 0;

            return (
              <Card
                key={supplier.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={
                            supplier.profile_avatar_url ||
                            "/placeholder-profile.png"
                          }
                          alt={supplier.business_name}
                        />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg truncate">
                            {supplier.business_name}
                          </CardTitle>
                          {supplier.is_verified && (
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        {supplier.city && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {supplier.city}, {supplier.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`p-2 ${
                        isFavoriteSupplier(supplier.id)
                          ? "text-pink-500 hover:text-pink-600"
                          : "text-gray-400 hover:text-pink-500"
                      }`}
                      onClick={() => {
                        if (isFavoriteSupplier(supplier.id)) {
                          removeFromFavoriteSuppliers(supplier.id);
                        } else {
                          addToFavoriteSuppliers({
                            id: supplier.id,
                            business_name: supplier.business_name,
                            profile_avatar_url: supplier.profile_avatar_url,
                            city: supplier.city,
                            is_verified: supplier.is_verified,
                            profile_id: supplier.profile_id,
                          });
                        }
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavoriteSupplier(supplier.id) ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Business Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-blue-600">
                        <Package className="w-4 h-4" />
                        <span>{supplier.total_products || 0} products</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {businessAge > 0 ? `${businessAge}y` : "New"}
                        </span>
                      </div>
                    </div>

                    {/* Business Type Badge */}
                    {supplier.business_type && (
                      <Badge variant="outline" className="text-xs">
                        {supplier.business_type}
                      </Badge>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/${supplier.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      {supplier.profile_id && (
                        <Link
                          href={`/messages/${supplier.profile_id}/chat`}
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Suppliers Link */}
        <div className="text-center pt-4">
          <Link href="/suppliers">
            <Button variant="outline" size="lg">
              View All Suppliers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
