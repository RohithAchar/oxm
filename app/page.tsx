export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import NewLandingPage from "@/components/home/NewLandingPage";

export const metadata: Metadata = {
  title: "Buy samples and bulk from verified suppliers | OpenXmart",
  description:
    "Discover and order product samples or bulk directly from verified Indian suppliers. Trusted by ecommerce sellers, retailers, and D2C brands.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "OpenXmart — Buy samples and bulk from verified suppliers",
    description:
      "Explore products, order samples, and place bulk orders with trusted Indian suppliers.",
    url: "/",
    siteName: "OpenXmart",
    images: [
      {
        url: "/image.jpeg",
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
    images: ["/image.jpeg"],
  },
  robots: { index: true, follow: true },
};

const Home = async () => {
  return <NewLandingPage />;
};

export default Home;
