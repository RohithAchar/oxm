import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserId } from "@/lib/controller/user/userOperations";
import { isBusinessExists } from "@/lib/controller/business/businessOperations";
import {
  Store,
  Zap,
  Wallet,
  LifeBuoy,
  ShieldCheck,
  Lock,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Start Supplying to Buyers | OpenXmart",
  description:
    "List products for free on OpenXmart and reach serious wholesale buyers across India. Get your first buyleads fast with zero cost.",
  alternates: {
    canonical: "/intro",
  },
  openGraph: {
    title: "Start Supplying to Buyers | OpenXmart",
    description:
      "List products for free and reach genuine wholesale buyers across India.",
    url: "/intro",
    siteName: "OpenXmart",
    type: "website",
    images: [
      {
        url: "/image.jpeg",
        width: 1200,
        height: 630,
        alt: "OpenXmart Supplier Onboarding",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Start Supplying to Buyers | OpenXmart",
    description:
      "List products for free and get your first buyleads quickly on OpenXmart.",
    images: ["/image.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function IntroPage() {
  const userId = await getUserId();
  const hasBusiness = await isBusinessExists(userId);

  return (
    <div className="px-4 lg:px-0 py-10 sm:py-14 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I become an OpenXmart supplier?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Simply sign up, complete your business profile, and upload the required documents. Once verified, you can list products and reach genuine buyers.",
                },
              },
              {
                "@type": "Question",
                name: "What documents are required for becoming an OpenXmart supplier?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Business Proof (GST/UDYAM/registration), Identity Proof (PAN), and Bank/UPI details for payouts.",
                },
              },
              {
                "@type": "Question",
                name: "Is there any fee to register as a supplier on OpenXmart?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Registering and listing products is free. A small commission applies only when you receive an order.",
                },
              },
              {
                "@type": "Question",
                name: "What type of proof of business is accepted?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "GST Certificate, UDYAM Certificate, Shops & Establishments License, Partnership Deed / MSME Certificate, or other government-recognized proof.",
                },
              },
            ],
          }),
        }}
      />
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
          Start Supplying to thousands of Buyers on <br />
          <span className="text-primary">OpenXmart</span>
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto">
          List your products for free and reach serious wholesale buyers across
          India. Get your first buyleads fast with zero cost.
        </p>
        <div className="pt-2 max-w-md mx-auto space-y-3">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto rounded-full px-8"
          >
            <Link href={hasBusiness ? "/supplier" : "/create-business"}>
              {hasBusiness ? "Manage Business" : "Start Listing Now"}
            </Link>
          </Button>
          <div>
            <Link
              href="#why-openxmart"
              className="inline-flex items-center justify-center text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn More →
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            <Image
              src="/placeholder-profile.png"
              alt="Supplier success"
              width={40}
              height={40}
              className="rounded-full shadow-sm"
            />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Real suppliers growing on OpenXmart
            </span>
          </div>
        </div>
      </section>

      <section id="why-openxmart" className="mt-12 sm:mt-14">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <Store className="text-primary h-6 w-6" />
              <h3 className="text-2xl font-medium mt-3">
                Emerging <span className="text-primary">B2B Marketplace</span>
              </h3>
              <p className="mt-3 text-muted-foreground">
                Thanks to OpenXmart’s growing network of verified buyers and
                suppliers, you can easily showcase your products to serious
                wholesale buyers across India.
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <Zap className="text-primary h-6 w-6" />
              <h3 className="text-2xl font-medium mt-3">
                Fast First <span className="text-primary">BuyLeads</span>
              </h3>
              <p className="mt-3 text-muted-foreground">
                With our trusted network and strong buyer flow, 50% of new
                suppliers receive their first buylead within just 1 day with
                zero cost.
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <Wallet className="text-primary h-6 w-6" />
              <h3 className="text-2xl font-medium mt-3">
                Zero Cost to <span className="text-primary">Start</span>
              </h3>
              <p className="mt-3 text-muted-foreground">
                List products for free with no upfront costs. Our platform is
                optimized for affordability in listing, marketing, and lead
                generation—perfect for growing businesses.
              </p>
            </CardContent>
          </Card>
          <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-6 sm:p-8">
              <LifeBuoy className="text-primary h-6 w-6" />
              <h3 className="text-2xl font-medium mt-3">
                <span className="text-primary font-semibold">Dedicated</span>{" "}
                Supplier Support
              </h3>
              <p className="mt-3 text-muted-foreground">
                From onboarding to scaling sales, we provide end-to-end supplier
                support—helping you build trust, close deals, and grow faster.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-12 sm:mt-16 rounded-xl bg-muted/40 px-4 sm:px-6 py-8">
        <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">
                👣 How do I become an OpenXmart supplier?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Simply sign up on our platform, complete your business profile,
                and upload the required documents. Once verified, you can start
                listing your products and reach genuine buyers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">
                📝 What documents are required for becoming an OpenXmart
                supplier?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>You will need to provide:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>
                    Business Proof (GST Certificate, UDYAM, or valid business
                    registration)
                  </li>
                  <li>Identity Proof (PAN card of the proprietor/partners)</li>
                  <li>Bank/UPI details for payouts</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">
                💰 Is there any fee to register as a supplier on OpenXmart?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No. Registering and listing products on OpenXmart is completely
                free. You only pay a small commission when you receive an order.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">
                📄 What type of proof of business is accepted?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>We accept multiple valid business proofs, including:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>GST Certificate</li>
                  <li>UDYAM Certificate</li>
                  <li>Shops & Establishments License</li>
                  <li>Partnership Deed / MSME Certificate</li>
                  <li>Any other government-recognized proof of business</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="grid gap-6 sm:grid-cols-3 text-center">
          <div className="rounded-lg border p-6">
            <Users className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-3xl font-semibold">10,000+</p>
            <p className="text-muted-foreground">
              Suppliers already on OpenXmart
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <Store className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-3xl font-semibold">1M+</p>
            <p className="text-muted-foreground">Products listed and growing</p>
          </div>
          <div className="rounded-lg border p-6">
            <Zap className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-3 text-3xl font-semibold">Fast</p>
            <p className="text-muted-foreground">Verified leads, not spam</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 opacity-70">
          <Image src="/next.svg" alt="Brand" width={80} height={24} />
          <Image src="/vercel.svg" alt="Brand" width={80} height={24} />
          <Image src="/globe.svg" alt="Brand" width={24} height={24} />
          <Image src="/window.svg" alt="Brand" width={24} height={24} />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Secure & Verified
          </span>
          <span className="inline-flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" /> Protected data & payments
          </span>
        </div>
      </section>
    </div>
  );
}
