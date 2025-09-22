"use client";

import { usePathname } from "next/navigation";
import React from "react";

export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isSpecialFullWidth =
    pathname?.startsWith("/supplier") || pathname?.startsWith("/admin");
  const maxWidthClass = isSpecialFullWidth ? "max-w-full" : "max-w-screen-2xl";
  return (
    <div
      className={`${maxWidthClass} mx-auto ${className} ${
        isSpecialFullWidth ? "px-0" : "px-4"
      }`}
    >
      {children}
    </div>
  );
}
