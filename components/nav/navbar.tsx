"use client";

import { usePathname } from "next/navigation";
import { Poppins } from "next/font/google";
import Link from "next/link";

import { ModeToggle } from "./theme-toggle-button";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="flex items-center bg-background justify-between py-2 px-4 border-b">
      <Link
        href="/"
        className={`${poppins.variable} text-primary text-lg tracking-wide font-bold`}
      >
        OxM
      </Link>
      <div className="flex items-center gap-6 text-muted-foreground">
        <ModeToggle />
      </div>
    </header>
  );
};
