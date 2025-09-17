import type { Metadata } from "next";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { H3 } from "@/components/ui/h3";
import { P } from "@/components/ui/p";

export const metadata: Metadata = {
  title: "Buyer Protection Policy | OpenXmart",
  description:
    "OpenXmart Buyer Protection Policy safeguards your money and orders with sample-first ordering, escrow-style payments, verified suppliers, and safe bulk deals.",
  alternates: {
    canonical: "https://openxmart.com/buyer-policy",
  },
  openGraph: {
    title: "Buyer Protection Policy | OpenXmart",
    description:
      "Trade with confidence: sample-first ordering, payment protection, verified suppliers, and safe bulk deals.",
    url: "https://openxmart.com/buyer-policy",
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buyer Protection Policy | OpenXmart",
    description:
      "Trade with confidence: sample-first ordering, payment protection, verified suppliers, and safe bulk deals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BuyerProtectionPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <header className="space-y-2">
        <P className="uppercase tracking-wide text-sm text-muted-foreground">
          Buyer protection
        </P>
        <H1 className="text-3xl font-semibold tracking-tight">
          OpenXmart Buyer Protection Policy: Trade With Confidence
        </H1>
        <P className="text-sm text-muted-foreground">
          At OpenXmart Technologies, we understand that trust is the backbone of
          B2B trade.
        </P>
      </header>

      <section className="mt-8 space-y-4 leading-7">
        <P>
          That’s why we’ve built a Buyer Protection Policy designed to safeguard
          your money, your products, and your business growth.
        </P>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <H2 className="text-xl font-semibold">Why Buyer Protection Matters</H2>
        <P>
          In today’s B2B landscape, scams, fake leads, and delayed deliveries
          are all too common. Buyers often hesitate to place orders, especially
          when dealing with new suppliers. Our Buyer Protection Policy solves
          this by making trust a built-in feature, not an afterthought.
        </P>
      </section>

      <section className="mt-8 space-y-4">
        <H2 className="text-xl font-semibold">How It Works</H2>
        <div className="space-y-6">
          <div className="space-y-2">
            <H3 className="font-semibold">1. Sample-First Ordering</H3>
            <P>
              Buyers can order product samples directly from verified suppliers
              before committing to bulk orders. This ensures you get to test
              product quality, packaging, and delivery reliability.
            </P>
          </div>

          <div className="space-y-2">
            <H3 className="font-semibold">2. Escrow-Style Payment Security</H3>
            <P>
              Payments are held securely with OpenXmart and released to
              suppliers only after successful delivery is confirmed. If issues
              arise, your money stays protected until resolved.
            </P>
          </div>

          <div className="space-y-2">
            <H3 className="font-semibold">3. Verified Suppliers Only</H3>
            <P>
              Every supplier undergoes strict verification checks (business
              proof, GST/UDYAM, or equivalent). You deal only with genuine,
              trustworthy businesses.
            </P>
          </div>

          <div className="space-y-2">
            <H3 className="font-semibold">4. Bulk Deal Confidence</H3>
            <P>
              Once satisfied with samples, buyers can directly negotiate bulk
              deals with suppliers. Our system ensures safe settlement and
              smooth logistics, so both sides win.
            </P>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-4 leading-7">
        <H2 className="text-xl font-semibold">The OpenXmart Promise</H2>
        <P>
          Our Buyer Protection Policy isn’t just about safe transactions — it’s
          about building confidence, reducing risks, and fueling long-term
          business partnerships. With OpenXmart, you’re not just buying
          products, you’re buying peace of mind.
        </P>
      </section>
    </main>
  );
}
