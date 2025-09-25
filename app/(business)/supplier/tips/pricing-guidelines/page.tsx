import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const sections = [
  { id: "intro", title: "OpenXmart Pricing Guidelines (For Suppliers)" },
  { id: "golden-rules", title: "1. Golden Rules of Pricing" },
  {
    id: "calc-samples",
    title: "2A. How to Calculate Correct Prices — Samples",
  },
  { id: "calc-bulk", title: "2B. How to Calculate Correct Prices — Bulk" },
  { id: "tier-pricing", title: "3. Bulk Tier Pricing (Must-Have)" },
  { id: "best-practices", title: "4. Best Practices to Win Buyers" },
  { id: "mistakes", title: "5. Common Mistakes to Avoid" },
  { id: "templates", title: "6. Quick Template You Can Follow" },
  { id: "psychological", title: "7. Psychological & Competitive Pricing" },
  { id: "ceo-note", title: "8. CEO’s Note for You" },
];

export default function SupplierPricingGuidelinesPage() {
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Pricing Guidelines
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Clear, all-in pricing with free delivery builds trust and boosts
              conversions.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t" />

      {/* Mobile TOC */}
      <div className="lg:hidden">
        <Card className="p-3">
          <h2 className="text-sm font-semibold mb-2">On this page</h2>
          <ScrollArea className="max-h-[40vh]">
            <nav className="flex flex-col gap-1">
              {sections.map((s) => (
                <Link
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {s.title}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Content (left) */}
        <section className="lg:col-span-9 order-2 lg:order-1">
          <div className="space-y-8 md:space-y-10">
            <article id="intro" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                OpenXmart Pricing Guidelines (For Suppliers)
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-3">
                Pricing is the most important part of your business on
                OpenXmart. Done right, it builds trust, wins buyers, and keeps
                your margins safe. Here’s the complete but easy guide.
              </p>
            </article>

            <Separator />

            <article id="golden-rules" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                1. Golden Rules of Pricing
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>
                  <strong>Samples = Door Opener:</strong> Price samples close to
                  cost. Your goal is to convince the buyer to place bulk orders.
                </li>
                <li>
                  <strong>Bulk = Profit Engine:</strong> Keep your margins in
                  bulk orders. That’s where your main earnings come from.
                </li>
                <li>
                  <strong>Free Delivery for Buyers:</strong> All prices must
                  already include delivery cost. Buyers should never pay extra
                  for shipping.
                </li>
                <li>
                  <strong>Commissions to Remember:</strong>
                  <div className="mt-1">
                    <div>• Samples → 10% platform commission</div>
                    <div>• Bulk → 3.4% platform commission</div>
                  </div>
                </li>
              </ul>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                More affordable samples = More bulk leads = More earnings.
              </p>
            </article>

            <Separator />

            <article id="calc-samples" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                2. How to Calculate Correct Prices — Samples
              </h2>
              <h3 className="font-medium mt-3">Formula</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                (COGS + Packaging + Average Delivery Cost) ÷ 0.75
                <br />
                <span className="italic">
                  (0.75 = after 15% profit + 10% commission)
                </span>
              </p>
              <h3 className="font-medium mt-3">Example</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                <li>Product cost (COGS) = ₹200</li>
                <li>Packaging = ₹20</li>
                <li>Delivery (avg.) = ₹80</li>
                <li>Total = ₹300</li>
                <li>
                  <strong>Final Sample Price</strong> = ₹300 ÷ 0.75 = ₹400
                </li>
              </ul>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                You get back ~₹400 after commission. Buyer sees free delivery,
                you don’t lose money.
              </p>
            </article>

            <Separator />

            <article id="calc-bulk" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                2. How to Calculate Correct Prices — Bulk Orders
              </h2>
              <h3 className="font-medium mt-3">Formula</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                (COGS + Packaging + Delivery per Unit) ÷ 0.966 × (1 + Profit %)
                <br />
                <span className="italic">(0.966 = after 3.4% commission)</span>
              </p>
              <h3 className="font-medium mt-3">Example</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                <li>COGS = ₹190</li>
                <li>Packaging = ₹5</li>
                <li>Delivery per unit = ₹15</li>
                <li>Total = ₹210</li>
                <li>
                  With 20% profit → <strong>210 ÷ 0.966 × 1.20 = ₹261</strong>{" "}
                  per unit
                </li>
              </ul>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                After commission, you still earn your 20% profit safely.
              </p>
            </article>

            <Separator />

            <article id="tier-pricing" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                3. Bulk Tier Pricing (Must-Have)
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-3">
                Always offer discounts when buyers purchase more. This
                encourages bigger orders.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                <li>MOQ 50 units → Base price (₹261)</li>
                <li>200 units → -3% (₹253)</li>
                <li>500 units → -6% (₹245)</li>
                <li>1000 units → -10% (₹235)</li>
              </ul>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Bigger order = lower unit price = higher trust and more repeat
                business.
              </p>
            </article>

            <Separator />

            <article id="best-practices" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                4. Best Practices to Win Buyers
              </h2>
              <ol className="list-decimal pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>
                  Keep Samples Attractive: Don’t overprice samples. If you do,
                  buyers won’t try.
                </li>
                <li>
                  Offer Sample Credit: Example: “Get 100% of sample price back
                  on first bulk order above ₹50,000.”
                </li>
                <li>
                  Always Show Free Delivery Badge: Buyers love “final price” —
                  no hidden charges.
                </li>
                <li>
                  Respond Fast: If buyer asks for custom pricing or large
                  quantity quote (buylead), reply within 2 hours.
                </li>
                <li>
                  Monitor Costs: If courier or raw material prices go up, adjust
                  quickly.
                </li>
              </ol>
            </article>

            <Separator />

            <article id="mistakes" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                5. Common Mistakes to Avoid
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>
                  Forgetting to include delivery in final price (biggest
                  mistake).
                </li>
                <li>Overpricing samples (kills conversion).</li>
                <li>Not offering tier pricing (buyers expect discounts).</li>
                <li>
                  Cutting prices too low without profit (unsustainable in bulk).
                </li>
                <li>
                  Using round figures wrongly (₹262.78 looks odd → better quote
                  ₹263 or ₹265).
                </li>
              </ul>
            </article>

            <Separator />

            <article id="templates" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                6. Quick Template You Can Follow
              </h2>
              <div className="mt-3 space-y-3 text-sm md:text-base text-muted-foreground">
                <div>
                  <strong>Sample Price (with free delivery):</strong>
                  <div>(COGS + Packaging + Delivery) ÷ 0.90</div>
                </div>
                <div>
                  <strong>Bulk Price (with free delivery):</strong>
                  <div>
                    (COGS + Packaging + Delivery per unit) ÷ 0.966 × (1 +
                    Profit%)
                  </div>
                </div>
                <div>
                  <strong>Tier Discount Plan:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>MOQ 50 → Base price</li>
                    <li>200 units → -3%</li>
                    <li>500 units → -6%</li>
                    <li>1000 units → -10%</li>
                  </ul>
                </div>
              </div>
            </article>

            <Separator />

            <article id="psychological" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                7. Psychological & Competitive Pricing
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>
                  Round prices to wholesale-friendly numbers: ₹99, ₹249, ₹499.
                </li>
                <li>
                  Show “Free Delivery Included” tag — buyers love all-in
                  pricing.
                </li>
                <li>Benchmark competitors quarterly and adjust margins.</li>
              </ul>
            </article>

            <Separator />

            <article id="ceo-note" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                8. CEO’s Note for You
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-3">
                At OpenXmart, we want every supplier to grow steadily. Smart
                pricing is not about being the cheapest — it’s about being
                clear, fair, and reliable. When buyers see transparent all-in
                pricing with free delivery, they trust you more and return for
                bigger orders.
              </p>
              <div className="text-sm md:text-base text-muted-foreground mt-2">
                Remember:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Samples open the door</li>
                  <li>Bulk builds your wealth</li>
                  <li>Transparency builds your brand</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        {/* Sticky Index (right) */}
        <aside className="hidden lg:block lg:col-span-3 order-1 lg:order-2">
          <div className="lg:sticky lg:top-24">
            <Card className="p-3 md:p-4">
              <h2 className="text-sm font-semibold mb-2 md:mb-3">
                On this page
              </h2>
              <Separator className="mb-2" />
              <ScrollArea className="max-h-[60vh] pr-2">
                <nav className="flex flex-col gap-1">
                  {sections.map((s) => (
                    <Link
                      key={s.id}
                      href={`#${s.id}`}
                      className="text-sm md:text-[0.95rem] text-muted-foreground hover:text-primary transition-colors py-1"
                    >
                      {s.title}
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
