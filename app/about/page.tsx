import type { Metadata } from "next";

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
      <header className="space-y-2">
        <p className="uppercase tracking-wide text-sm text-muted-foreground">About</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          OpenXmart: Powering a Trust-Driven B2B Future in India
        </h1>
        <p className="text-sm text-muted-foreground">By OpenXmart Technologies</p>
      </header>

      <hr className="my-8" />

      <section className="space-y-4 leading-7">
        <p>
          In a marketplace full of chaos, OpenXmart brings clarity. In today’s fast-paced business world, finding trustworthy suppliers and genuine buyers is harder than ever. While India is booming with entrepreneurial energy and small businesses are thriving, one problem continues to plague the system — lack of trust and transparency in the B2B space.
        </p>
        <p>That’s where OpenXmart steps in.</p>
        <p>
          We’re not just building another marketplace. We’re building India’s most trusted B2B platform — where businesses connect, trade, and grow with confidence.
        </p>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">🌟 Our Company: OpenXmart Technologies</h2>
        <p>
          At the heart of OpenXmart is our company, OpenXmart Technologies — a next-generation B2B tech startup founded with a single mission:
        </p>
        <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
          To simplify business-to-business trade in India through sample-first trust, verified transactions, and transparent buyer-seller connections.
        </blockquote>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">🔥 The Vision Behind OpenXmart</h2>
        <p>
          At OpenXmart, our mission is simple yet powerful — <strong>Empowering Businesses. Fueling the Economy.</strong>
        </p>
        <p>
          But this is more than just business. It’s a movement to restore trust, transparency, and fairness in Indian commerce — so every deal is confident, and every business can grow with dignity.
        </p>
        <p className="italic">— Rithish Shetty<br />Founder &amp; CEO, OpenXmart Technologies</p>
      </section>

      <section className="mt-10 space-y-5">
        <h2 className="text-xl font-semibold">🛠️ What Makes OpenXmart Different?</h2>
        <h3 className="text-lg font-medium">💡 Why OpenXmart is Different from Other B2B Platforms</h3>
        <p>
          At OpenXmart Technologies, we’re not just building another B2B marketplace — we’re building India’s most trusted one. Here’s how we stand out:
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold">🧪 1. Sample-First Buying System</h4>
            <p>
              Unlike traditional platforms, buyers on OpenXmart can order samples directly from verified sellers — with full protection.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>No blind bulk orders</li>
              <li>Try before you trust</li>
              <li>Built-in dispute resolution</li>
            </ul>
            <p className="text-sm text-muted-foreground">✅ Experience first. Decide next.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🔐 2. Real Trust Score – Not Just Badges</h4>
            <p>We don’t sell “verified” labels. Suppliers earn their Trust Score through:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Document verification (PAN, GST)</li>
              <li>On-time sample dispatch</li>
              <li>Quality feedback from real buyers</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              A transparent system that rewards trust, not money.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">🛡️ 3. Buyer Protection That Works</h4>
            <p>Every sample order is backed by our strong Buyer Protection Policy:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Payment is held safely until delivery</li>
              <li>2-day buyer check period before fund release</li>
              <li>Fast complaint system for fake/damaged items</li>
              <li>Only verified suppliers can sell</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              You are protected from fraud, delays, and poor quality — every time.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">📈 4. Growth Tools for Sellers</h4>
            <p>We give sellers the power to grow with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Free access to buyer leads</li>
              <li>Custom storefronts</li>
              <li>SEO-optimized listings</li>
              <li>Lead management dashboard</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Your growth is our growth — not pay-per-lead.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-4 leading-7">
        <h2 className="text-xl font-semibold">🤝 Building a Business with You, Not Just for You</h2>
        <p>
          Whether you're just starting out or scaling up — OpenXmart is designed to grow with you. We listen. We innovate. We adapt.
        </p>
        <p>
          Our roadmap is shaped by feedback from real users — buyers and sellers who want more control, more transparency, and more support in the digital age. We’re building something for Bharat, not just for big cities.
        </p>
      </section>

      <section className="mt-10 space-y-4 leading-7">
        <h2 className="text-xl font-semibold">📢 Join the Trust Revolution</h2>
        <p>
          We’re not here to become the next Alibaba. We’re here to become the most trusted B2B marketplace in India.
        </p>
        <p>If you believe in:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Honest trade</li>
          <li>Real connections</li>
          <li>Building something long-term</li>
        </ul>
        <p>Then OpenXmart is where you belong.</p>
        <div className="space-y-1">
          <p>
            🔗 Visit us: <a className="underline" href="https://www.openxmart.com" target="_blank" rel="noopener noreferrer">www.openxmart.com</a>
          </p>
          <p>
            📱 Follow us on Instagram: <a className="underline" href="https://instagram.com/openxmart" target="_blank" rel="noopener noreferrer">@openxmart</a>
          </p>
        </div>
      </section>

      <hr className="my-8" />

      <section className="space-y-3">
        <blockquote className="border-l-4 pl-4 italic">
          “This is my journey from zero — and OpenXmart is the startup that will change how bharath does business.”
        </blockquote>
        <p className="italic">— Rithish Shetty, Founder</p>
      </section>
    </main>
  );
}


