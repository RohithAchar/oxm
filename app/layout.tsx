import "./globals.css";
import Providers from "@/lib/Providers";

import { Navbar } from "@/components/nav/navbar";
import MobileMenu from "@/components/nav/mobile-menu";
import { Open_Sans, Playfair_Display } from "next/font/google";
import PhoneNumberPopover from "@/components/phone-number-popover";

export const metadata = {
  title:
    "Buy samples and bulk products from verified suppliers | OpenXmart B2B India",
  description:
    "OpenXmart helps you order product samples and bulk directly from verified Indian suppliers. Trusted by ecommerce sellers, dropshippers, retailers, and D2C brands.",
  keywords: [
    "B2B Marketplace",
    "Supplier Platform",
    "Product Samples",
    "Business Orders",
    "OpenXmart",
  ],
  openGraph: {
    title: "OpenXmart — India’s B2B marketplace for samples and bulk orders",
    description:
      "Order product samples and place bulk orders with verified Indian suppliers.",
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
  twitter: {
    card: "summary_large_image",
    title: "OpenXmart — India’s B2B marketplace for samples and bulk orders",
    description:
      "Order product samples and place bulk orders with verified Indian suppliers.",
    // images: ["/og-image.jpg"],
  },
  metadataBase: new URL("https://openxmart.com"),
};

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap", // Optional: improves loading performance
  variable: "--font-open-sans", // Optional: creates a CSS variable
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap", // Optional: improves loading performance
  variable: "--font-playfair-display", // Optional: creates a CSS variable
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <Providers>
          <Navbar />
          <MobileMenu />
          <main className="pt-14 font-playfair">{children}</main>
          <PhoneNumberPopover />
        </Providers>
      </body>
    </html>
  );
}
