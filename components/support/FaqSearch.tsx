"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

interface FaqSearchProps {
  onQueryChange: (q: string) => void;
}

export default function FaqSearch({ onQueryChange }: FaqSearchProps) {
  const [query, setQuery] = useState("");
  const debounced = useMemo(() => {
    let t: any;
    return (value: string) => {
      clearTimeout(t);
      t = setTimeout(() => onQueryChange(value), 200);
    };
  }, [onQueryChange]);

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          debounced(e.target.value);
        }}
        placeholder="Search FAQs..."
      />
    </div>
  );
}
