"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera } from "lucide-react";
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
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const heightClass =
    size === "sm" ? "h-8" : size === "lg" ? "h-12 md:h-14" : "h-10 md:h-12";
  const btnHeightClass =
    size === "sm" ? "h-8 px-2.5" : size === "lg" ? "h-10 px-4" : "h-9 px-3.5";
  const paddingX = size === "sm" ? "px-2.5" : size === "lg" ? "px-5" : "px-4";
  const paddingY = size === "sm" ? "py-1" : size === "lg" ? "py-3" : "py-2";
  const radiusClass = rounded === "full" ? "rounded-full" : "rounded-md";

  useEffect(() => {
    try {
      const raw = localStorage.getItem("oxm_recent_searches");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecent(parsed.slice(0, 10));
      }
    } catch {}
  }, []);

  const saveRecent = (q: string) => {
    const next = [
      q,
      ...recent.filter((x) => x.toLowerCase() !== q.toLowerCase()),
    ].slice(0, 10);
    setRecent(next);
    try {
      localStorage.setItem("oxm_recent_searches", JSON.stringify(next));
    } catch {}
  };

  const submit = () => {
    const q = value.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    saveRecent(q);
    setValue("");
    setOpen(false);
  };

  const onSelectSuggestion = (q: string) => {
    router.push(`/products?q=${encodeURIComponent(q)}`);
    saveRecent(q);
    setValue("");
    setOpen(false);
  };

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return recent;
    return recent.filter((r) => r.toLowerCase().includes(q));
  }, [recent, value]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-stretch gap-0 ${radiusClass} border border-muted bg-card/60 backdrop-blur overflow-hidden`}
      >
        <div className="relative flex-1">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground md:h-5 md:w-5 ${
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
            }`}
          />
          <Input
            className={`w-full ${heightClass} bg-transparent outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
              size === "sm" ? "text-xs" : "text-sm md:text-base"
            } placeholder:text-muted-foreground pl-8 md:pl-9 pr-2 md:pr-3 rounded-none`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            onFocus={() => setOpen(true)}
          />
        </div>
        {showCamera && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex cursor-pointer text-muted-foreground hover:text-foreground"
            aria-label="Image Search (coming soon)"
          >
            <Camera className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        )}
        {buttonMode === "icon" ? (
          <Button
            className="rounded-full cursor-pointer"
            size="icon"
            aria-label="Search"
            onClick={submit}
          >
            <Search className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            className={`rounded-none rounded-r-full cursor-pointer ${heightClass} py-0 flex-shrink-0 px-4 md:px-5 border-0 shadow-none bg-primary text-primary-foreground hover:bg-primary/90 -ml-px`}
            onClick={submit}
          >
            Search
          </Button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full">
          <div className="rounded-lg border bg-popover text-popover-foreground shadow-md overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((s, idx) => (
                <button
                  key={`${s}-${idx}`}
                  className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm md:text-base"
                  onClick={() => onSelectSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30">
              <span className="text-xs text-muted-foreground">
                Recent searches
              </span>
              <button
                className="text-xs text-primary hover:underline cursor-pointer"
                onClick={() => {
                  setRecent([]);
                  try {
                    localStorage.removeItem("oxm_recent_searches");
                  } catch {}
                  setOpen(false);
                }}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
