import type { Metadata } from "next";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { P } from "@/components/ui/p";

export const metadata: Metadata = {
  title: "Refund Policy | OpenXmart",
  description:
    "Understand OpenXmart's refund policy for sample orders and timelines for refunds.",
  alternates: {
    canonical: "https://openxmart.com/refund-policy",
  },
  openGraph: {
    title: "Refund Policy | OpenXmart",
    description:
      "OpenXmart refund rules for sample orders and refund timelines.",
    url: "https://openxmart.com/refund-policy",
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | OpenXmart",
    description:
      "OpenXmart refund rules for sample orders and refund timelines.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <H1 className="text-3xl font-semibold tracking-tight">
        OpenXmart Refund Policy
      </H1>
      <P className="mt-2 text-sm text-muted-foreground">
        Last updated: August 14, 2025
      </P>

      <P className="mt-6 leading-7">
        We aim to protect Buyers while ensuring Supplier fairness.
      </P>

      <hr className="my-8" />

      <section className="space-y-3">
        <H2 className="text-xl font-semibold">1. Sample Orders</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Refunds allowed if Supplier fails to dispatch within promised time.
          </li>
          <li>
            Once dispatched, no refund unless shipment fails due to Supplier
            fault.
          </li>
          <li>Shipping charges are non-refundable.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">
          2. Refund Method &amp; Timeline
        </H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Refunds processed to the original payment method within 5–7 working
            days (as per RBI norms).
          </li>
        </ul>
      </section>
    </main>
  );
}
