"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SimpleEnhancedSearch from "@/components/search/SimpleEnhancedSearch";

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
      <SimpleEnhancedSearch
        placeholder="Search winning products & verified suppliers"
        size="lg"
        rounded="full"
        buttonMode="label"
        showSuggestions={true}
        maxSuggestions={8}
        className="w-full"
      />
    </div>
  );
}

export default LandingSearchBar;
