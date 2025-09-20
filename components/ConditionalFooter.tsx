"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Don't render footer for supplier pages since they have their own footer
  if (pathname?.startsWith("/supplier")) {
    return null;
  }
  
  return <Footer />;
}
