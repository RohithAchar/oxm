"use client";

import { useFavoriteSuppliers } from "@/lib/contexts/favorite-suppliers-context";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, MessageCircle, CheckCircle, Heart } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function FavoriteSuppliersPage() {
  const { favoriteSuppliers, removeFromFavoriteSuppliers } =
    useFavoriteSuppliers();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Favorite Suppliers
          </h1>
          <p className="text-muted-foreground mt-2">
            Your saved suppliers for easy access and quick communication
          </p>
        </div>

        {favoriteSuppliers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No favorite suppliers yet
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                Start exploring products and add suppliers to your favorites for
                quick access.
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favoriteSuppliers.map((supplier) => (
              <Card
                key={supplier.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
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
                          <span>{supplier.city}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex gap-2">
                    <Link href={`/${supplier.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </Link>
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromFavoriteSuppliers(supplier.id)}
                      className="px-3 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
                    >
                      <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
