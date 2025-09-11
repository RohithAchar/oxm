"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LandingSearchBar() {
  const [value, setValue] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Load recent searches on mount
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
    const next = [q, ...recent.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 10);
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

  // Filter suggestions by current input
  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return recent;
    return recent.filter((r) => r.toLowerCase().includes(q));
  }, [recent, value]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-full border border-muted bg-card/60 backdrop-blur px-4 md:px-5 py-2 md:py-3 shadow-sm hover:shadow transition focus-within:ring-2 focus-within:ring-primary/30">
        <div className="pl-1 pr-1.5 md:pl-1.5 md:pr-2 text-muted-foreground">
          <Search className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <Input
          className="w-full h-10 md:h-12 bg-transparent outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base placeholder:text-muted-foreground px-2 md:px-3"
          placeholder="Search winning products & verified suppliers"
          value={value}
          onChange={(e) => { setValue(e.target.value); setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          onFocus={() => setOpen(true)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex cursor-pointer text-muted-foreground hover:text-foreground"
          aria-label="Image Search (coming soon)"
        >
          <Camera className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        <Button className="rounded-full cursor-pointer h-9 md:h-10 px-4 md:px-5" onClick={submit}>
          Search
        </Button>
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full max-w-3xl left-0 right-0 mx-auto">
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
              <span className="text-xs text-muted-foreground">Recent searches</span>
              <button
                className="text-xs text-primary hover:underline cursor-pointer"
                onClick={() => { setRecent([]); try { localStorage.removeItem("oxm_recent_searches"); } catch {} setOpen(false); }}
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

export default LandingSearchBar;


