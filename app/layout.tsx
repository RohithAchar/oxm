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

export const metadata: Metadata = {
  title:
    "OpenXMart - The Future of B2B Sampling | Secure Sample Ordering Platform",
  description:
    "Connect with trusted suppliers and order samples seamlessly. OpenXMart makes B2B sampling simple, secure, and efficient for modern businesses.",
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
          <div className="bg-muted p-4">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
