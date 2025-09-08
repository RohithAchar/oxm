import type { Metadata } from "next";

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
        <p className="uppercase tracking-wide text-sm text-muted-foreground">Buyer protection</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          OpenXmart Buyer Protection Policy: Trade With Confidence
        </h1>
        <p className="text-sm text-muted-foreground">At OpenXmart Technologies, we understand that trust is the backbone of B2B trade.</p>
      </header>

      <section className="mt-8 space-y-4 leading-7">
        <p>
          That’s why we’ve built a Buyer Protection Policy designed to safeguard your money, your products, and your business growth.
        </p>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why Buyer Protection Matters</h2>
        <p>
          In today’s B2B landscape, scams, fake leads, and delayed deliveries are all too common. Buyers often hesitate to place orders, especially when dealing with new suppliers.
          Our Buyer Protection Policy solves this by making trust a built-in feature, not an afterthought.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">1. Sample-First Ordering</h3>
            <p>
              Buyers can order product samples directly from verified suppliers before committing to bulk orders. This ensures you get to test product quality, packaging, and delivery reliability.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">2. Escrow-Style Payment Security</h3>
            <p>
              Payments are held securely with OpenXmart and released to suppliers only after successful delivery is confirmed. If issues arise, your money stays protected until resolved.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">3. Verified Suppliers Only</h3>
            <p>
              Every supplier undergoes strict verification checks (business proof, GST/UDYAM, or equivalent). You deal only with genuine, trustworthy businesses.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">4. Bulk Deal Confidence</h3>
            <p>
              Once satisfied with samples, buyers can directly negotiate bulk deals with suppliers. Our system ensures safe settlement and smooth logistics, so both sides win.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-4 leading-7">
        <h2 className="text-xl font-semibold">The OpenXmart Promise</h2>
        <p>
          Our Buyer Protection Policy isn’t just about safe transactions — it’s about building confidence, reducing risks, and fueling long-term business partnerships. With OpenXmart, you’re not just buying products, you’re buying peace of mind.
        </p>
      </section>
    </main>
  );
}


