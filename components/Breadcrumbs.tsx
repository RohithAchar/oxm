"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";

export function GlobalBreadcrumbs() {
  const pathname = usePathname();
  if (pathname?.startsWith("/supplier")) {
    return null;
  }
  if (pathname?.startsWith("/admin")) {
    return (
      <div className="flex-1 flex items-center">
        <Breadcrumbs />
      </div>
    );
  }
  return <Breadcrumbs />;
}

export function SupplierBreadcrumbs() {
  const pathname = usePathname();
  if (!pathname?.startsWith("/supplier")) {
    return null;
  }
  return (
    <div className="flex-1 flex items-center">
      <Breadcrumbs />
    </div>
  );
}

function toTitleCase(segment: string): string {
  const cleaned = segment.replace(/[-_]+/g, " ");
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/") {
    return null;
  }

  const parts = pathname.split("/").filter(Boolean);
  const segments: { label: string; href: string }[] = [];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    segments.push({
      label: toTitleCase(decodeURIComponent(part)),
      href: current,
    });
  }

  const isSupplier = pathname.startsWith("/supplier");
  const isAdmin = pathname.startsWith("/admin");
  const containerClass = isSupplier || isAdmin ? "px-0 py-0" : "pt-3 pb-0";

  return (
    <div className={containerClass}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((seg, index) => (
            <React.Fragment key={seg.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === segments.length - 1 ? (
                  <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={seg.href}>{seg.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
