import Link from "next/link";
import type { Metadata } from "next";

import { getCategoriesWithChildren } from "@/lib/controller/categories/categoriesOperation";
import { getCategoryIcon } from "@/components/home/categories-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1 } from "@/components/ui/h1";
import { P } from "@/components/ui/p";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://openxmart.com";

export const metadata: Metadata = {
  title: "Product Categories | OpenXmart",
  description:
    "Browse OpenXmart's verified sourcing categories and explore curated sub-categories managed by qualified Indian suppliers.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "OpenXmart categories",
    "wholesale categories India",
    "supplier categories",
    "bulk sourcing categories",
  ],
  alternates: {
    canonical: `${SITE_URL}/categories`,
  },
  openGraph: {
    title: "Product Categories | OpenXmart",
    description:
      "Discover apparel, home goods, beauty, packaging, and more from vetted Indian manufacturers on OpenXmart.",
    url: `${SITE_URL}/categories`,
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Categories | OpenXmart",
    description:
      "Explore every category on OpenXmart and connect with verified suppliers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const categoriesJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  url: `${SITE_URL}/categories`,
  name: "OpenXmart Categories",
  description:
    "See every OpenXmart sourcing category along with curated sub-categories managed by trusted suppliers.",
};

type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description?: string | null;
  children?: CategoryRecord[];
};

const CategoryCard = ({ category }: { category: CategoryRecord }) => {
  const Icon = getCategoryIcon(category.name);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="rounded-full bg-muted p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">
            {category.name}
          </CardTitle>
          <P className="text-sm text-muted-foreground mt-1">
            {category.description ||
              "Curated assortment managed by verified OpenXmart suppliers."}
          </P>
        </div>
      </CardHeader>
      <CardContent>
        {category.children && category.children.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm text-foreground hover:bg-muted transition-colors"
              >
                {child.name}
              </Link>
            ))}
          </div>
        ) : (
          <P className="text-sm text-muted-foreground">
            Sub-categories are being curated.
          </P>
        )}
      </CardContent>
    </Card>
  );
};

const EmptyState = () => (
  <div className="rounded-lg border px-6 py-12 text-center">
    <H1 className="text-2xl font-semibold">No categories found</H1>
    <P className="mt-2 text-muted-foreground">
      Connect your Supabase categories table and reload this page to see live
      data.
    </P>
  </div>
);

export default async function CategoriesPage() {
  const categories = (await getCategoriesWithChildren()) as CategoryRecord[];

  return (
    <main className="container mx-auto max-w-6xl px-4 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoriesJsonLd) }}
      />
      <header className="space-y-3 text-center md:text-left">
        <H1 className="text-3xl font-semibold tracking-tight">
          Browse Every Category
        </H1>
        <P className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto md:mx-0">
          Explore live sourcing categories backed by verified Indian suppliers.
          Tap a sub-category to open matching product listings.
        </P>
      </header>

      {categories.length === 0 ? (
        <EmptyState />
      ) : (
        <section className="grid gap-4 md:gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </section>
      )}
    </main>
  );
}

