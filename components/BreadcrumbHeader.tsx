"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function toTitleCase(segment: string): string {
  const cleaned = segment.replace(/[-_]+/g, " ");
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function BreadcrumbHeader() {
  const pathname = usePathname();
  const router = useRouter();

  if (!pathname || pathname === "/") {
    return null;
  }

  const segments = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const acc: { label: string; href: string }[] = [];
    let current = "";
    for (const part of parts) {
      current += `/${part}`;
      acc.push({ label: toTitleCase(decodeURIComponent(part)), href: current });
    }
    return acc;
  }, [pathname]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="w-full bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Breadcrumb>
          <BreadcrumbList className="text-sm">
            {segments.length > 4 ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {segments.slice(-2).map((seg, idx) => (
                  <>
                    <BreadcrumbItem key={seg.href}>
                      {idx === segments.slice(-2).length - 1 ? (
                        <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={seg.href}>{seg.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {idx < segments.slice(-2).length - 1 ? (
                      <BreadcrumbSeparator />
                    ) : null}
                  </>
                ))}
              </>
            ) : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((seg, index) => (
                  <>
                    <BreadcrumbSeparator key={`${seg.href}-sep`} />
                    <BreadcrumbItem key={seg.href}>
                      {index === segments.length - 1 ? (
                        <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={seg.href}>{seg.label}</BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </>
                ))}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}


