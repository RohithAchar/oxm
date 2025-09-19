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
  const isSupplier = pathname?.startsWith("/supplier");
  const maxWidthClass = isSupplier ? "max-w-full" : "max-w-screen-2xl";
  return (
    <div
      className={`${maxWidthClass} mx-auto ${className} ${
        isSupplier ? "px-0" : "px-4"
      }`}
    >
      {children}
    </div>
  );
}
