import type { Metadata } from "next";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { H3 } from "@/components/ui/h3";
import { H4 } from "@/components/ui/h4";
import { P } from "@/components/ui/p";

export const metadata: Metadata = {
  title: "About | OpenXmart",
  description:
    "OpenXmart Technologies is building India's most trusted B2B marketplace with sample-first trust, verified transactions, and transparent buyer-seller connections.",
  alternates: {
    canonical: "https://openxmart.com/about",
  },
  openGraph: {
    title: "About OpenXmart",
    description:
      "Powering a trust-driven B2B future in India through sample-first trust and verified trade.",
    url: "https://openxmart.com/about",
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About OpenXmart",
    description:
      "Powering a trust-driven B2B future in India through sample-first trust and verified trade.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <header className="space-y-4">
        <H1 className="text-3xl font-semibold tracking-tight">
          OpenXmart: Powering a Trust-Driven B2B Future in India
        </H1>
      </header>

      <hr className="my-8" />

      <section className="space-y-4 leading-7">
        <P>
          In a marketplace full of chaos, OpenXmart brings clarity. In today’s
          fast-paced business world, finding trustworthy suppliers and genuine
          buyers is harder than ever. While India is booming with
          entrepreneurial energy and small businesses are thriving, one problem
          continues to plague the system — lack of trust and transparency in the
          B2B space.
        </P>
        <P>That’s where OpenXmart steps in.</P>
        <P>
          We’re not just building another marketplace. We’re building India’s
          most trusted B2B platform — where businesses connect, trade, and grow
          with confidence.
        </P>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <H2 className="text-xl font-semibold">
          🌟 Our Company: OpenXmart Technologies
        </H2>
        <P>
          At the heart of OpenXmart is our company, OpenXmart Technologies — a
          next-generation B2B tech startup founded with a single mission:
        </P>
        <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
          To simplify business-to-business trade in India through sample-first
          trust, verified transactions, and transparent buyer-seller
          connections.
        </blockquote>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <H2 className="text-xl font-semibold">
          🔥 The Vision Behind OpenXmart
        </H2>
        <P>
          At OpenXmart, our mission is simple yet powerful —{" "}
          <strong>Empowering Businesses. Fueling the Economy.</strong>
        </P>
        <P>
          But this is more than just business. It's a movement to restore trust,
          transparency, and fairness in Indian commerce — so every deal is made
          with confidence, and every business can grow with dignity.
        </P>
        <P className="italic">
          — Rithish Shetty
          <br />
          Founder &amp; CEO, OpenXmart Technologies
        </P>
      </section>

      <section className="mt-10 space-y-5">
        <H2 className="text-xl font-semibold">
          🛠️ What Makes OpenXmart Different?
        </H2>
        <H3 className="text-lg font-medium">
          💡 Why OpenXmart is Different from Other B2B Platforms
        </H3>
        <P>
          At OpenXmart Technologies, we’re not just building another B2B
          marketplace — we’re building India’s most trusted one. Here’s how we
          stand out:
        </P>

        <div className="space-y-6">
          <div className="space-y-2">
            <H4 className="font-semibold">🧪 1. Sample-First Buying System</H4>
            <P>
              Unlike traditional platforms, buyers on OpenXmart can order
              samples directly from verified sellers — with full protection.
            </P>
            <ul className="list-disc pl-6 space-y-1">
              <li>No blind bulk orders</li>
              <li>Try before you trust</li>
              <li>Built-in dispute resolution</li>
            </ul>
            <P className="text-sm text-muted-foreground">
              ✅ Experience first. Decide later.
            </P>
          </div>

          <div className="space-y-2">
            <H4 className="font-semibold">
              🔐 2. Real Trust Score – Not Just Badges
            </H4>
            <P>
              We don’t sell “verified” labels. Suppliers earn their Trust Score
              through:
            </P>
            <ul className="list-disc pl-6 space-y-1">
              <li>Document verification (PAN, GST)</li>
              <li>On-time sample dispatch</li>
              <li>Quality feedback from real buyers</li>
            </ul>
            <P className="text-sm text-muted-foreground">
              A transparent system that rewards trust, not money.
            </P>
          </div>

          <div className="space-y-2">
            <H4 className="font-semibold">🛡️ 3. Buyer Protection That Works</H4>
            <P>
              Every sample order is backed by our strong Buyer Protection
              Policy:
            </P>
            <ul className="list-disc pl-6 space-y-1">
              <li>Payment is held safely until delivery</li>
              <li>2-day buyer review period before fund release</li>
              <li>Fast complaint system for fake/damaged items</li>
              <li>Only verified suppliers can sell</li>
            </ul>
            <P className="text-sm text-muted-foreground">
              You are protected from fraud, delays, and poor quality — every
              time.
            </P>
          </div>

          <div className="space-y-2">
            <H4 className="font-semibold">📈 4. Growth Tools for Sellers</H4>
            <P>We give sellers the power to grow with:</P>
            <ul className="list-disc pl-6 space-y-1">
              <li>Free access to buyer leads</li>
              <li>Custom storefronts</li>
              <li>SEO-optimized listings</li>
              <li>Lead management dashboard</li>
            </ul>
            <P className="text-sm text-muted-foreground">
              Your growth is our growth — no pay-per-lead fees.
            </P>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-4 leading-7">
        <H2 className="text-xl font-semibold">
          🤝 Building a Business with You, Not Just for You
        </H2>
        <P>
          Whether you're just starting out or scaling up — OpenXmart is designed
          to grow with you. We listen. We innovate. We adapt.
        </P>
        <P>
          Our roadmap is shaped by feedback from real users — buyers and sellers
          who want more control, more transparency, and more support in the
          digital age. We’re building something for Bharat, not just for big
          cities.
        </P>
      </section>

      <section className="mt-10 space-y-4 leading-7">
        <H2 className="text-xl font-semibold">📢 Join the Trust Revolution</H2>
        <P>
          We’re not here to become the next Alibaba. We’re here to become the
          most trusted B2B marketplace in India.
        </P>
        <P>If you believe in:</P>
        <ul className="list-disc pl-6 space-y-1">
          <li>Honest trade</li>
          <li>Real connections</li>
          <li>Building something long-term</li>
        </ul>
        <P>Then OpenXmart is where you belong.</P>
        <div className="space-y-1">
          <P>
            🔗 Visit us:{" "}
            <a
              className="underline"
              href="https://www.openxmart.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.openxmart.com
            </a>
          </P>
          <P>
            📱 Follow us on Instagram:{" "}
            <a
              className="underline"
              href="https://instagram.com/openxmart"
              target="_blank"
              rel="noopener noreferrer"
            >
              @openxmart
            </a>
          </P>
        </div>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <blockquote className="border-l-4 pl-4 italic">
          "This is my journey from zero — and OpenXmart is the startup that will
          change how Bharat does business."
        </blockquote>
        <P className="italic">— Rithish Shetty, Founder</P>
      </section>
    </main>
  );
}
