import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const sections = [
  { id: "getting-started", title: "1. Getting Started with OpenXmart" },
  { id: "product-listing", title: "2. Product Listing Guidelines" },
  { id: "order-flow", title: "3. Order Flow on OpenXmart" },
  { id: "commission-payouts", title: "4. Commission & Payouts" },
  { id: "trust-score", title: "5. Trust Score System" },
  { id: "tutorials-tools", title: "6. Tutorials & Tools" },
  { id: "best-practices", title: "7. Best Practices & Tricks" },
  { id: "trade-assurance", title: "8. Trade Assurance & Protection" },
  { id: "support-help", title: "9. Support & Help" },
  { id: "ceo-note", title: "Final Note from the CEO" },
];

export default function SupplierBasicGuidelinesPage() {
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Supplier Basic Guidelines
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              OpenXmart.com — India’s new-age B2B marketplace. Follow these
              steps to set up, list, and grow effectively.
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
            <article id="getting-started" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                1. Getting Started with OpenXmart
              </h2>
              <div className="mt-3 space-y-3">
                <h3 className="font-medium">Account Setup</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                  <li>Register with your verified email or Google account.</li>
                  <li>
                    Business Proof: Upload GSTIN. PAN is required for payouts.
                  </li>
                  <li>Phone Verification: Add at least 2 contact numbers.</li>
                  <li>
                    Bank/UPI Setup: Payout account must match business PAN.
                  </li>
                </ul>
                <h3 className="font-medium">Profile Completion Checklist</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                  <li>Upload company logo and product images.</li>
                  <li>Add business description and industries served.</li>
                  <li>Mention years in business and certifications.</li>
                  <li>Provide warehouse and shipping address.</li>
                </ul>
              </div>
            </article>

            <Separator />

            <article id="product-listing" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                2. Product Listing Guidelines
              </h2>
              <div className="mt-3 space-y-3">
                <h3 className="font-medium">Images</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                  <li>Use high-quality images with white background.</li>
                  <li>Add multiple angles: front, side, close-up.</li>
                  <li>Avoid watermarks or unclear pictures.</li>
                </ul>
                <h3 className="font-medium">Descriptions</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                  <li>Keep it clear and keyword-rich.</li>
                  <li>
                    Include size, material, MOQ, packaging, shipping options.
                  </li>
                  <li>Use bullet points for quick readability.</li>
                </ul>
                <h3 className="font-medium">Pricing</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                  <li>Mention sample price separately from bulk pricing.</li>
                  <li>Keep pricing competitive and transparent.</li>
                </ul>
              </div>
            </article>

            <Separator />

            <article id="order-flow" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                3. Order Flow on OpenXmart
              </h2>
              <ol className="list-decimal pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>Enquiry → Buyer shows interest.</li>
                <li>
                  Buylead → Buyer shares exact requirement (quantity, specs,
                  timeline).
                </li>
                <li>Sample Order → Buyer tests product. Fulfill fast.</li>
                <li>Bulk Order → Buyer purchases larger quantities.</li>
              </ol>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Tip: Buyers who get samples delivered quickly are 3x more likely
                to place bulk orders with the same supplier.
              </p>
            </article>

            <Separator />

            <article id="commission-payouts" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                4. Commission & Payouts
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>Sample Orders: 10% commission + Shipping Cost.</li>
                <li>Bulk Orders: 3.4% from supplier + Shipping Cost.</li>
                <li>
                  Settlement: Payments released 2–4 days after successful
                  delivery.
                </li>
              </ul>
              <Card className="mt-3 p-3 md:p-4 bg-accent/50">
                <p className="text-sm md:text-base">
                  Example: Bulk order ₹1,00,000 → You receive ₹96,600 − Shipping
                  Cost after commission.
                </p>
              </Card>
            </article>

            <Separator />

            <article id="trust-score" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                5. Trust Score System
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>Profile Verification = 100 points.</li>
                <li>Each Successful Sample = +50 points.</li>
                <li>Each Successful Bulk Order = +200 points.</li>
              </ul>
              <p className="text-sm md:text-base text-muted-foreground mt-2">
                Higher trust score = more visibility and priority in buyer
                searches.
              </p>
            </article>

            <Separator />

            <article id="tutorials-tools" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                6. Tutorials & Tools
              </h2>
              <div className="mt-3 space-y-3">
                <h3 className="font-medium">Tutorials (Coming Soon)</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                  <li>How to upload your first product</li>
                  <li>How to fulfill a sample order</li>
                  <li>How to manage bulk shipping via OpenXmart</li>
                  <li>How to grow your trust score</li>
                </ul>
                <h3 className="font-medium">Suggested Tools</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground">
                  <li>Canva / Photoshop for product photos</li>
                  <li>Google Sheets for tracking enquiries & sales</li>
                  <li>Tally / Zoho Books for accounting & GST</li>
                  <li>Shiprocket / RapidShyp for shipments</li>
                </ul>
              </div>
            </article>

            <Separator />

            <article id="best-practices" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                7. Best Practices & Tricks to Succeed
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>Respond fast: Reply within 2 hours.</li>
                <li>Keep stock updated to avoid cancellations.</li>
                <li>Ship samples quickly for higher conversion to bulk.</li>
                <li>Use tier pricing (e.g., 100 pcs = ₹50; 1000 pcs = ₹45).</li>
                <li>Promote reviews after bulk orders.</li>
                <li>
                  Stay professional: avoid pushing off-platform during samples.
                </li>
              </ul>
            </article>

            <Separator />

            <article id="trade-assurance" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                8. Trade Assurance & Buyer Protection
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>Buyer payments held securely until successful delivery.</li>
                <li>
                  Damage in delivery covered up to 20% under Trade Assurance.
                </li>
                <li>Boosts buyer confidence → more orders.</li>
              </ul>
            </article>

            <Separator />

            <article id="support-help" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                9. Support & Help
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-muted-foreground mt-3">
                <li>Supplier Helpdesk: support@openxmart.com</li>
                <li>
                  WhatsApp Support: Verified business account (coming soon)
                </li>
                <li>Training Sessions: Monthly webinars</li>
              </ul>
            </article>

            <Separator />

            <article id="ceo-note" className="scroll-mt-24">
              <h2 className="text-lg md:text-2xl font-semibold">
                Final Note from the CEO
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-3">
                Empowering Businesses. Fueling the Economy. Every order
                fulfilled and every trust point earned builds your reputation
                across the Indian B2B market. Treat OpenXmart as your long-term
                business partner.
              </p>
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
