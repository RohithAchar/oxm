import type { Metadata } from "next";
import { Inter, Roboto, Open_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";

import { Navbar } from "@/components/nav/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "OpenXmart – B2B Marketplace for Indian Businesses",
  description:
    "Discover and connect with suppliers. Order product samples and manage business purchases in one platform.",
  keywords: [
    "B2B Marketplace",
    "Supplier Platform",
    "Product Samples",
    "Business Orders",
    "OpenXmart",
  ],
  openGraph: {
    title: "OpenXmart",
    description:
      "Indian B2B Marketplace – Order product samples and connect with verified suppliers.",
    url: "https://openxmart.com",
    siteName: "OpenXmart",
    // images: [
    //   {
    //     url: "/og-image.jpg", // Add a relevant image in public/
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: "en_IN",
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "OpenXmart",
  //   description:
  //     "Order samples, connect with suppliers – India's B2B Marketplace.",
  //   images: ["/og-image.jpg"],
  // },
  metadataBase: new URL("https://openxmart.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Navbar />
          <div className="bg-muted">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
