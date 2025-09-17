import type { Metadata } from "next";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { H3 } from "@/components/ui/h3";
import { P } from "@/components/ui/p";

export const metadata: Metadata = {
  title: "Privacy Policy | OpenXmart",
  description:
    "Read OpenXmart's Privacy Policy to understand how we collect, use, share, and protect your data in compliance with DPDPA 2023.",
  alternates: {
    canonical: "https://openxmart.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | OpenXmart",
    description:
      "How OpenXmart collects, uses, shares, and protects your information.",
    url: "https://openxmart.com/privacy-policy",
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | OpenXmart",
    description:
      "How OpenXmart collects, uses, shares, and protects your information.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <H1 className="text-3xl font-semibold tracking-tight">
        OpenXmart Privacy Policy
      </H1>
      <P className="mt-2 text-sm text-muted-foreground">
        Last updated: August 14, 2025
      </P>

      <P className="mt-6 leading-7">
        This Privacy Policy ("Policy") explains how OpenXmart Technologies
        ("Company", "we", "our", "us") collects, uses, shares, and protects
        personal and business information of users ("you", "your", "Buyer", or
        "Supplier") when you access or use our platform, services, and related
        features. By registering, browsing, or transacting on OpenXmart, you
        agree to the practices described in this Policy.
      </P>

      <hr className="my-8" />

      <section className="space-y-4">
        <H2 className="text-xl font-semibold">1. Information We Collect</H2>
        <P>We may collect the following categories of information:</P>
        <div className="space-y-3">
          <div>
            <H3 className="font-medium">(a) Personal Information</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name, contact number, email address.</li>
              <li>
                Government-issued identification (GSTIN, Udyam, PAN, etc.).
              </li>
              <li>Business registration details.</li>
            </ul>
          </div>
          <div>
            <H3 className="font-medium">(b) Transaction Information</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Payment details (UPI, bank transfers, card payments – processed
                securely via RBI-compliant payment gateways).
              </li>
              <li>Order history, invoices, and refund records.</li>
            </ul>
          </div>
          <div>
            <H3 className="font-medium">(c) Technical Information</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cookies and tracking data for analytics and advertising.</li>
              <li>Location data (when enabled).</li>
            </ul>
          </div>
          <div>
            <H3 className="font-medium">(d) Communication Data</H3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Messages exchanged between Buyers and Suppliers on the platform.
              </li>
              <li>
                WhatsApp OTP verification logs (retained only for verification
                and deleted within 30 days).
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">
          2. How We Use Your Information
        </H2>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Verify identity and register accounts.</li>
          <li>Process payments, refunds, and transactions securely.</li>
          <li>Enable Buyer–Supplier communication.</li>
          <li>Provide logistics, delivery, and shipment tracking.</li>
          <li>
            Improve website performance, SEO ranking, and user experience.
          </li>
          <li>Comply with legal, tax, and regulatory requirements.</li>
          <li>
            Send service updates, security alerts, and promotional offers (with
            user consent).
          </li>
        </ol>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">3. Legal Basis &amp; Consent</H2>
        <P>
          We comply with the Digital Personal Data Protection Act, 2023 (DPDPA).
          Users may withdraw consent for marketing or data processing at any
          time by writing to{" "}
          <a className="underline" href="mailto:support@openxmart.com">
            support@openxmart.com
          </a>
          . Certain information may be retained as required by law.
        </P>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">4. Information Sharing</H2>
        <P>We do not sell or rent user data. Limited sharing may occur:</P>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            With Suppliers: Buyer contact details only after a confirmed
            order/lead.
          </li>
          <li>
            With Buyers: Supplier contact details after order or lead
            confirmation.
          </li>
          <li>
            With Payment Gateways: To process transactions via RBI-regulated
            partners.
          </li>
          <li>With Logistics Partners: To facilitate shipping.</li>
          <li>With Legal Authorities: If required under applicable law.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">
          5. Data Protection &amp; Security
        </H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>All payments processed via PCI-DSS compliant gateways.</li>
          <li>Encryption, firewalls, and access controls safeguard data.</li>
          <li>Users are responsible for protecting their login credentials.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">6. Data Retention</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Personal data retained only as long as required for business
            operations, compliance, or dispute resolution.
          </li>
          <li>OTP logs deleted within 30 days.</li>
          <li>
            Users may request account deletion, subject to legal retention
            requirements.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">7. User Rights</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access, review, and correct personal data.</li>
          <li>Request deletion of your account (subject to law).</li>
          <li>Opt-out of marketing communications.</li>
          <li>Withdraw consent for data processing.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">8. Third-Party Links</H2>
        <P>
          We are not responsible for the privacy practices of external websites
          linked from OpenXmart.
        </P>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">9. Policy Updates</H2>
        <P>
          We may update this Policy periodically. Continued use of the platform
          signifies acceptance.
        </P>
      </section>

      <section className="mt-8 space-y-3">
        <H2 className="text-xl font-semibold">10. Contact Us</H2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Email:{" "}
            <a className="underline" href="mailto:support@openxmart.com">
              support@openxmart.com
            </a>
          </li>
          <li>Location: Karnataka, India</li>
        </ul>
      </section>
    </main>
  );
}
