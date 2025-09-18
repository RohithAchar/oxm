import "./globals.css";
import Providers from "@/lib/Providers";

import { Navbar } from "@/components/nav/navbar";
import MobileMenu from "@/components/nav/mobile-menu";
import RegisterSW from "@/components/RegisterSW";
import Footer from "@/components/footer";
import { ErrorBoundary } from "@/components/error-boundary";
import BreadcrumbHeader from "@/components/BreadcrumbHeader";
import Container from "@/components/common/Container";

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
  manifest: "/manifest.webmanifest",
};

// Removed Google font imports; using SF Pro system stack via globals.css

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/android-chrome-192x192.png" />
        <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" />
      </head>
      <body
        className={`antialiased overflow-x-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0`}
      >
        <Providers>
          <ErrorBoundary>
            <Navbar />
            <MobileMenu />
            <main
              className="pt-14 md:pt-14 md:pb-0"
              style={{
                paddingLeft: "env(safe-area-inset-left)",
                paddingRight: "env(safe-area-inset-right)",
              }}
            >
              <Container>
                <BreadcrumbHeader />
                {children}
              </Container>
            </main>
            <RegisterSW />
            <Footer />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
