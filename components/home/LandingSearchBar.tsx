"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LandingSearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const submit = () => {
    const q = value.trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setValue("");
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/70 backdrop-blur px-4 md:px-5 py-2 md:py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/30">
        <div className="pl-1 pr-1.5 md:pl-1.5 md:pr-2 text-muted-foreground">
          <Search className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <Input
          className="w-full h-10 md:h-12 bg-transparent outline-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base placeholder:text-muted-foreground px-2 md:px-3"
          placeholder="Search winning products & verified suppliers"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <Button
          className="rounded-full cursor-pointer h-9 md:h-10 px-4 md:px-5"
          onClick={submit}
        >
          Search
        </Button>
      </div>
    </div>
  );
}

export default LandingSearchBar;
