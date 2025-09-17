import type { Metadata } from "next";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { P } from "@/components/ui/p";

export const metadata: Metadata = {
  title: "Terms & Conditions | OpenXmart",
  description:
    "Read OpenXmart's Terms & Conditions governing the use of our B2B marketplace.",
  alternates: {
    canonical: "https://openxmart.com/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | OpenXmart",
    description:
      "Terms governing Buyers and Suppliers on OpenXmart's B2B marketplace.",
    url: "https://openxmart.com/terms-and-conditions",
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | OpenXmart",
    description:
      "Terms governing Buyers and Suppliers on OpenXmart's B2B marketplace.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <H1 className="text-3xl font-semibold tracking-tight">
        OpenXmart Terms &amp; Conditions
      </H1>
      <P className="mt-2 text-sm text-muted-foreground">
        Last updated: August 14, 2025
      </P>

      <P className="mt-6 leading-7">
        Welcome to OpenXmart! By accessing or using our platform, you agree to
        the following terms.
      </P>

      <hr className="my-8" />

      <section className="space-y-3">
        <H2 className="text-xl font-semibold">1. Nature of the Platform</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            OpenXmart is a B2B marketplace operated by OpenXmart Technologies.
          </li>
          <li>
            We connect Buyers and Suppliers for product testing (samples) and
            safe bulk deals.
          </li>
          <li>
            We are not the manufacturer or seller of listed products. Suppliers
            are solely responsible for authenticity, quality, and legality of
            goods.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">2. Buyer Responsibilities</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide accurate details for contact, shipping, and payment.</li>
          <li>Review product samples before bulk purchases.</li>
          <li>Comply with import/export and business transaction laws.</li>
          <li>Avoid misuse of supplier details (spamming, fraud).</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">3. Supplier Responsibilities</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Provide accurate product descriptions, pricing, and specifications.
          </li>
          <li>Dispatch within committed timelines using secure packaging.</li>
          <li>
            Ensure compliance with legal standards, certifications, and IP
            rights.
          </li>
          <li>
            Suppliers agree to indemnify OpenXmart against claims, damages, or
            losses arising from counterfeit, illegal, or misrepresented goods.
          </li>
          <li>
            Fake or fraudulent practices will result in permanent suspension.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">
          4. Platform Role &amp; Liability
        </H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            OpenXmart acts as a facilitator. We are not liable for product
            quality, delivery, or disputes.
          </li>
          <li>
            Payments are processed via RBI-compliant escrow/payment partners.
            Funds are released to Suppliers only after shipment confirmation.
          </li>
          <li>
            Disputes should first be resolved between Buyer and Supplier.
            OpenXmart may mediate but is not legally bound to resolve every
            case.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">
          5. Account Suspension &amp; Termination
        </H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Accounts may be suspended/terminated for fraud, violations, or
            misuse.
          </li>
          <li>
            Suspended accounts may lose access to pending payments and services.
          </li>
        </ul>
      </section>
    </main>
  );
}
