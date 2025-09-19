"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProductSearchProps = {
  placeholder?: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
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
    size === "xxs"
      ? "h-6"
      : size === "xs"
      ? "h-7"
      : size === "sm"
      ? "h-8"
      : size === "lg"
      ? "h-12 md:h-14"
      : "h-10 md:h-12";
  const btnHeightClass =
    size === "xxs"
      ? "h-6 px-1.5"
      : size === "xs"
      ? "h-7 px-2"
      : size === "sm"
      ? "h-8 px-2.5"
      : size === "lg"
      ? "h-10 px-4"
      : "h-9 px-3.5";
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
    <div className={`relative w-full ${className}`}>
      <Search
        className={`pointer-events-none absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
          size === "xxs"
            ? "h-2.5 w-2.5"
            : size === "xs"
            ? "h-3 w-3"
            : size === "sm"
            ? "h-3.5 w-3.5"
            : "h-4 w-4 md:h-5 md:w-5"
        }`}
      />
      <Input
        className={`w-full ${heightClass} ${radiusClass} bg-background border-input ${
          size === "xxs"
            ? "pl-6 pr-7"
            : size === "xs"
            ? "pl-7 pr-8"
            : "pl-8 sm:pl-9 pr-10"
        } outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 ${
          size === "xxs"
            ? "text-[10px]"
            : size === "xs"
            ? "text-[11px]"
            : size === "sm"
            ? "text-xs"
            : "text-sm md:text-base"
        } placeholder:text-muted-foreground`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        aria-label="Search"
      />
      {buttonMode === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          onClick={submit}
          className={`absolute right-0.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${
            size === "xxs" ? "h-6 w-6 p-0" : size === "xs" ? "h-7 w-7 p-0" : ""
          }`}
        >
          <Search
            className={`${
              size === "xxs"
                ? "h-3 w-3"
                : size === "xs"
                ? "h-3.5 w-3.5"
                : "h-4 w-4 md:h-5 md:w-5"
            }`}
          />
        </Button>
      ) : (
        <Button
          onClick={submit}
          className={`absolute right-1.5 top-1/2 -translate-y-1/2 ${btnHeightClass} ${radiusClass}`}
        >
          Search
        </Button>
      )}
    </div>
  );
}
