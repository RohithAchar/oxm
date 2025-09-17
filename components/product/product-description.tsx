"use client";

import { useState } from "react";
import { Muted } from "@/components/ui/muted";

const Description = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 100; // number of characters to show before "..."

  if (text.length <= limit) {
    return <Muted className="text-sm mt-1">{text}</Muted>;
  }

  return (
    <Muted className="text-sm mt-1">
      {expanded ? text : text.slice(0, limit) + "..."}{" "}
      <button
        className="text-primary underline ml-1 hover:cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "Show less" : "More"}
      </button>
    </Muted>
  );
};

export default Description;
