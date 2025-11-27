export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import NewLandingPage from "@/components/home/NewLandingPage";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://openxmart.com";
const HERO_IMAGE = `${SITE_URL}/image.jpeg`;

export const metadata: Metadata = {
  title: "Buy samples and bulk from verified suppliers | OpenXmart",
  description:
    "Discover and order product samples or bulk directly from verified Indian suppliers. Trusted by ecommerce sellers, retailers, and D2C brands.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "B2B marketplace India",
    "buy product samples",
    "verified Indian suppliers",
    "bulk sourcing platform",
    "OpenXmart",
  ],
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "OpenXmart — Buy samples and bulk from verified suppliers",
    description:
      "Explore products, order samples, and place bulk orders with trusted Indian suppliers.",
    url: `${SITE_URL}/`,
    siteName: "OpenXmart",
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: "OpenXmart B2B Marketplace",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenXmart — Buy samples and bulk from verified suppliers",
    description:
      "Explore products, order samples, and place bulk orders with trusted Indian suppliers.",
    images: [HERO_IMAGE],
  },
  robots: { index: true, follow: true },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OpenXmart",
  url: SITE_URL,
  logo: HERO_IMAGE,
  sameAs: ["https://instagram.com/openxmart"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@openxmart.com",
      telephone: "+91-99889-00991",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  ],
};

const Home = async () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <NewLandingPage />
    </>
  );
};

export default Home;
