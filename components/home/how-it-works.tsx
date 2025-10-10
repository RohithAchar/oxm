"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Handshake, Package, ShieldCheck, Sparkles } from "lucide-react";
import { H2 } from "../ui/h2";
import { P } from "../ui/p";

type StepKey = "browse" | "samples" | "contact" | "protection";

interface StepItem {
  key: StepKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
}

const HOW_IT_WORKS_STEPS: StepItem[] = [
  {
    key: "browse",
    title: "Browse Products",
    description: "Explore products from verified Indian suppliers.",
    icon: Sparkles,
    image: "/how_it_works/browse_products_1.webp",
  },
  {
    key: "samples",
    title: "Order Samples",
    description: "Test product quality before bulk buying.",
    icon: Package,
    image: "/how_it_works/browse_products_1.webp",
  },
  {
    key: "contact",
    title: "Contact Suppliers",
    description: "Buy directly and build long-term partnerships.",
    icon: Handshake,
    image: "/how_it_works/browse_products_1.webp",
  },
  {
    key: "protection",
    title: "Buyer Protection",
    description: "Your money is safe until delivery is verified.",
    icon: ShieldCheck,
    image: "/how_it_works/browse_products_1.webp",
  },
];

export default function HowItWorks() {
  const [activeIdx, setActiveIdx] = useState(0);

  const active = HOW_IT_WORKS_STEPS[activeIdx];

  // Auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((p) => (p + 1) % HOW_IT_WORKS_STEPS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const steps = useMemo(() => HOW_IT_WORKS_STEPS, []);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-screen">
      {/* Left: vertical steps with circular icons */}
      <div className="space-y-12 relative">
        <div className="w-full">
          <H2 className="text-lg sm:text-3xl md:text-4xl font-semibold text-foreground">
            How OpenXmart works for you
          </H2>
          <P className="text-sm sm:text-base -mt-2">
            A simple, transparent process designed to connect you with verified
            suppliers and quality products.
          </P>
        </div>
        {/* Steps list with its own connector line (not behind the heading) */}
        <div className="relative">
          <div className="pointer-events-none absolute left-6 top-0 bottom-0 w-px bg-muted-foreground/30" />
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeIdx;
            return (
              <button
                key={s.key}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "w-full text-left flex items-start gap-4 group mb-12 last:mb-0"
                )}
              >
                <div
                  className={cn(
                    "relative z-10 h-12 w-12 shrink-0 rounded-full border overflow-hidden flex items-center justify-center transition-all",
                    isActive ? "border-primary" : "border-muted-foreground/20"
                  )}
                >
                  {/* Solid fill to block connector line */}
                  <span className="absolute inset-0 bg-background" />
                  {isActive ? (
                    <span className="absolute inset-0 bg-primary/10" />
                  ) : (
                    <span className="absolute inset-0 bg-muted" />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 h-6 w-6 transition-opacity",
                      isActive
                        ? "opacity-100 text-primary"
                        : "opacity-40 text-foreground/70"
                    )}
                  />
                </div>
                <div className="space-y-1">
                  <div
                    className={cn(
                      "font-medium text-lg transition-opacity",
                      isActive ? "opacity-100" : "opacity-60"
                    )}
                  >
                    {s.title}
                  </div>
                  <div
                    className={cn(
                      "text-sm text-muted-foreground transition-opacity",
                      isActive ? "opacity-100" : "opacity-60"
                    )}
                  >
                    {s.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: image panel */}
      <Card className="border-none relative aspect-square w-full min-h-[320px] overflow-hidden shadow-none">
        <Image
          key={active.image}
          src={active.image}
          alt={active.title}
          fill
          priority
          className="object-cover"
        />
      </Card>
    </div>
  );
}
