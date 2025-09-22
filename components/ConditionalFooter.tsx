"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Don't render footer for supplier/admin pages since they have their own footer
  if (pathname?.startsWith("/supplier") || pathname?.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}
