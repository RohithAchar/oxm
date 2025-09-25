import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import FaqSearch from "@/components/support/FaqSearch";
import FaqAccordion from "@/components/support/FaqAccordion";
import { faqCategories, supplierFaqs } from "@/lib/utils/faq-data";
import { useMemo } from "react";

export default function HelpCenterPage() {
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Help Center
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Find quick answers to common supplier questions.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t" />

      {/* Search */}
      {/* Client component filtered in-page via hashless query state in children */}
      {/* For a simple server component page, we'll just render all FAQs grouped; search can be added client-side later. */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Content */}
        <section className="lg:col-span-9 order-2 lg:order-1">
          <div className="space-y-8 md:space-y-10">
            {faqCategories.map((cat) => {
              const items = supplierFaqs.filter((f) => f.category === cat);
              return (
                <div
                  key={cat}
                  id={`cat-${cat.replace(/\s+/g, "-")}`}
                  className="scroll-mt-24"
                >
                  <h2 className="text-lg md:text-2xl font-semibold">{cat}</h2>
                  <div className="mt-3">
                    <FaqAccordion items={items} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Index (desktop only) */}
        <aside className="hidden lg:block lg:col-span-3 order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <Card className="p-3 md:p-4">
              <h2 className="text-sm font-semibold mb-2 md:mb-3">
                Browse by category
              </h2>
              <Separator className="mb-2" />
              <ScrollArea className="max-h-[60vh] pr-2">
                <nav className="flex flex-col gap-1">
                  {faqCategories.map((c) => (
                    <Link
                      key={c}
                      href={`#cat-${c.replace(/\s+/g, "-")}`}
                      className="text-sm md:text-[0.95rem] text-muted-foreground hover:text-primary transition-colors py-1"
                    >
                      {c}
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
            </Card>
          </div>
        </aside>
      </div>
    </main>
  );
}
