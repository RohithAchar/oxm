import type { Metadata } from "next";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { P } from "@/components/ui/p";

export const metadata: Metadata = {
  title: "Shipping Policy | OpenXmart",
  description:
    "Learn about OpenXmart's shipping policy for sample and bulk orders, timelines, and responsibilities.",
  alternates: {
    canonical: "https://openxmart.com/shipping-policy",
  },
  openGraph: {
    title: "Shipping Policy | OpenXmart",
    description:
      "OpenXmart shipping rules, timelines, responsibilities, and limitations of liability.",
    url: "https://openxmart.com/shipping-policy",
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Policy | OpenXmart",
    description:
      "OpenXmart shipping rules, timelines, responsibilities, and limitations of liability.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShippingPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <H1 className="text-3xl font-semibold tracking-tight">
        OpenXmart Shipping Policy
      </H1>
      <P className="mt-2 text-sm text-muted-foreground">
        Last updated: August 14, 2025
      </P>

      <section className="mt-6 space-y-3">
        <H2 className="text-xl font-semibold">1. Sample Orders</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Shipping included in sample price unless stated otherwise.</li>
          <li>
            Delivery time: 3–10 working days (based on Supplier dispatch &amp;
            courier).
          </li>
          <li>Tracking details provided upon shipment.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">2. Bulk Orders</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Suppliers must provide accurate L/W/H &amp; weight before shipping.
          </li>
          <li>
            Buyers must pay actual logistics charges directly through
            OpenXmart’s partnered logistics API.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">
          3. Packaging &amp; Responsibility
        </H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Suppliers must pack goods securely. Damages from poor packaging =
            Supplier’s liability.
          </li>
          <li>Incorrect Buyer delivery details = no refund eligibility.</li>
          <li>
            OpenXmart is not liable for courier delays, customs, or force
            majeure.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">4. Limitation of Liability</H2>
        <P>
          OpenXmart’s liability in any shipping dispute shall not exceed the
          transaction value of the order.
        </P>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">
          Dispute Resolution &amp; Governing Law
        </H2>
        <P>
          Disputes must first be attempted to resolve between Buyer and
          Supplier. If unresolved, disputes shall be referred to arbitration
          under the Arbitration &amp; Conciliation Act, 1996. Seat of
          arbitration: Karnataka, India. Governing law: Laws of India.
        </P>
      </section>
    </main>
  );
}
