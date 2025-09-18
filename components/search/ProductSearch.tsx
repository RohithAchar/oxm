"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductSearchProps = {
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  rounded?: "full" | "md";
  showCamera?: boolean;
  className?: string;
  // If true, renders a compact icon-only submit button
  buttonMode?: "label" | "icon";
};

export default function ProductSearch({
  placeholder = "Search products",
  size = "md",
  rounded = "full",
  showCamera = false,
  className = "",
  buttonMode = "label",
}: ProductSearchProps) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const heightClass =
    size === "sm" ? "h-8" : size === "lg" ? "h-12 md:h-14" : "h-10 md:h-12";
  const btnHeightClass =
    size === "sm" ? "h-8 px-2.5" : size === "lg" ? "h-10 px-4" : "h-9 px-3.5";
  const paddingX = size === "sm" ? "px-2.5" : size === "lg" ? "px-5" : "px-4";
  const paddingY = size === "sm" ? "py-1" : size === "lg" ? "py-3" : "py-2";
  const radiusClass = rounded === "full" ? "rounded-full" : "rounded-md";

  const submit = () => {
    const q = value.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setValue("");
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 rounded-full border border-border/60 bg-muted/70 backdrop-blur  w-full`}
      >
        <div className="relative flex-1">
          <Search
            className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground md:h-5 md:w-5 ${
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
            }`}
          />
          <Input
            className={`w-full ${heightClass} bg-transparent rounded-full outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
              size === "sm" ? "text-xs" : "text-sm md:text-base"
            } placeholder:text-muted-foreground pl-7 sm:pl-8 md:pl-9 pr-2 md:pr-3`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            aria-label="Search"
          />
        </div>
        {buttonMode === "icon" ? (
          <Button
            className={`absolute right-0 rounded-full cursor-pointer ${heightClass} py-0 flex-shrink-0 px-3`}
            size="icon"
            aria-label="Search"
            onClick={submit}
          >
            <Search className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        ) : (
          <Button
            className={`absolute right-0 rounded-full cursor-pointer ${heightClass} py-0 flex-shrink-0 px-4 md:px-5`}
            onClick={submit}
          >
            Search
          </Button>
        )}
      </div>
    </div>
  );
}
