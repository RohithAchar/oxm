import Link from "next/link";
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 lg:py-16">
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
                  text:
                    "Simply sign up, complete your business profile, and upload the required documents. Once verified, you can list products and reach genuine buyers.",
                },
              },
              {
                "@type": "Question",
                name:
                  "What documents are required for becoming an OpenXmart supplier?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "Business Proof (GST/UDYAM/registration), Identity Proof (PAN), and Bank/UPI details for payouts.",
                },
              },
              {
                "@type": "Question",
                name:
                  "Is there any fee to register as a supplier on OpenXmart?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "No. Registering and listing products is free. A small commission applies only when you receive an order.",
                },
              },
              {
                "@type": "Question",
                name: "What type of proof of business is accepted?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text:
                    "GST Certificate, UDYAM Certificate, Shops & Establishments License, Partnership Deed / MSME Certificate, or other government-recognized proof.",
                },
              },
            ],
          }),
        }}
      />
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
          Start Supplying to thousands of Buyers on <span className="text-primary">OpenXmart</span>
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto">
          List your products for free and reach serious wholesale buyers across India. Get your first buyleads fast with zero cost.
        </p>
        <div className="pt-2">
          <Button asChild size="lg" className="px-8">
            <Link href={hasBusiness ? "/supplier" : "/create-business"}>
              {hasBusiness ? "Manage Business" : "Start Listing Now"}
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-14 sm:mt-16">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold">
                Emerging <span className="text-primary">B2B Marketplace</span>
              </h3>
              <p className="mt-3 text-muted-foreground">
                Thanks to OpenXmart’s growing network of verified buyers and suppliers, you can easily showcase your products to serious wholesale buyers across India.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold">
                Fast First <span className="text-primary">BuyLeads</span>
              </h3>
              <p className="mt-3 text-muted-foreground">
                With our trusted network and strong buyer flow, 50% of new suppliers receive their first buylead within just 1 day with zero cost.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold">
                Zero Cost to <span className="text-primary">Start</span>
              </h3>
              <p className="mt-3 text-muted-foreground">
                List products for free with no upfront costs. Our platform is optimized for affordability in listing, marketing, and lead generation—perfect for growing businesses.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold">
                <span className="text-primary">Dedicated</span> Supplier Support
              </h3>
              <p className="mt-3 text-muted-foreground">
                From onboarding to scaling sales, we provide end-to-end supplier support—helping you build trust, close deals, and grow faster.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-16 sm:mt-20">
        <h2 className="text-3xl font-semibold tracking-tight">FAQ</h2>
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">How do I become an OpenXmart supplier?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Simply sign up on our platform, complete your business profile, and upload the required documents. Once verified, you can start listing your products and reach genuine buyers.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">What documents are required for becoming an OpenXmart supplier?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>You will need to provide:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Business Proof (GST Certificate, UDYAM, or valid business registration)</li>
                  <li>Identity Proof (PAN card of the proprietor/partners)</li>
                  <li>Bank/UPI details for payouts</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">Is there any fee to register as a supplier on OpenXmart?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No. Registering and listing products on OpenXmart is completely free. You only pay a small commission when you receive an order.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold">What type of proof of business is accepted?</AccordionTrigger>
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
    </div>
  );
}