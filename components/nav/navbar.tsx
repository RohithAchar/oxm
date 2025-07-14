"use client";

import { Search, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";
import CategorySidebar from "../category/sidebar";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between bg-white py-2 px-4">
      <Link
        href="/"
        className={`${poppins.variable} text-primary text-lg tracking-wide font-bold`}
      >
        OxM
      </Link>
      <div className="flex items-center gap-6 text-muted-foreground">
        <Search strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
        <Link href={"/bag"}>
          <ShoppingBag
            strokeWidth={1.5}
            className={cn(
              `h-4.5 w-4.5 cursor-pointer`,
              pathname === "/bag" && "text-primary"
            )}
          />
        </Link>
        {/* <CategorySidebar /> */}
      </div>
    </header>
  );
};
