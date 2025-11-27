import { Suspense } from "react";
import type { Metadata } from "next";

import ProductsRouteLoadingMount from "@/components/product/products-route-loading-mount";
import ProductsContent from "@/components/product/products-content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://openxmart.com";

export const metadata: Metadata = {
  title: "Products | OpenXmart",
  description:
    "Browse trending private-label products, order samples, and convert to bulk with trusted Indian manufacturers on OpenXmart.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "OpenXmart products",
    "buy product samples India",
    "wholesale marketplace listings",
    "bulk sourcing products",
  ],
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
  openGraph: {
    title: "Products | OpenXmart",
    description:
      "Discover curated products across apparel, beauty, home and more from verified Indian suppliers.",
    url: `${SITE_URL}/products`,
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | OpenXmart",
    description:
      "Source trending private-label products from verified Indian suppliers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const productsJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  url: `${SITE_URL}/products`,
  name: "OpenXmart Products",
  description:
    "Browse OpenXmart's live product catalogue and order samples or bulk quantities from trusted suppliers.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />
      {/* Lightweight client loading indicator for route/query changes */}
      <ProductsRouteLoadingMount />
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="sticky top-14 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-28 rounded-md bg-muted animate-pulse" />
                  <div className="h-9 w-20 rounded-md bg-muted animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                </div>
                <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="aspect-square w-full rounded-lg bg-muted animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-8 justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-md bg-muted animate-pulse"
                />
              ))}
            </div>
          </div>
        }
      >
        {/* Products content is server-rendered and data-fetching */}
        {/* We pass resolved params to ensure stable serialization */}
        <ProductsContent params={params} />
      </Suspense>
    </div>
  );
}
