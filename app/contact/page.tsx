import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1 } from "@/components/ui/h1";
import { H2 } from "@/components/ui/h2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { P } from "@/components/ui/p";
import { Textarea } from "@/components/ui/textarea";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://openxmart.com";

export const metadata: Metadata = {
  title: "Contact OpenXmart",
  description:
    "Reach the OpenXmart support, partnerships, and supplier onboarding teams. We're here to help with product sourcing, logistics, and platform questions.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "OpenXmart contact",
    "B2B marketplace support",
    "supplier onboarding help",
    "sales enquiry OpenXmart",
  ],
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: "Contact OpenXmart",
    description:
      "Connect with OpenXmart for sales enquiries, support tickets, and supplier onboarding questions.",
    url: `${SITE_URL}/contact`,
    siteName: "OpenXmart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact OpenXmart",
    description:
      "Get in touch with the OpenXmart team for support, partnerships, or supplier onboarding.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: "OpenXmart",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "sales@openxmart.com",
        telephone: "+91-99889-00990",
        areaServed: "IN",
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@openxmart.com",
        telephone: "+91-99889-00991",
        areaServed: "IN",
      },
    ],
  },
};

const contactChannels = [
  {
    label: "Sales & Partnerships",
    email: "sales@openxmart.com",
    phone: "+91 99889 00990",
    sla: "Replies within 1 business day",
  },
  {
    label: "Buyer Support",
    email: "support@openxmart.com",
    phone: "+91 99889 00991",
    sla: "Live support 10 AM – 7 PM IST",
  },
  {
    label: "Supplier Onboarding",
    email: "suppliers@openxmart.com",
    phone: "+91 99889 00992",
    sla: "Account setup in 48 hours",
  },
];

const officeLocations = [
  {
    city: "Bengaluru HQ",
    addressLine: "91 Springboard, Koramangala 7th Block",
    details: "Operations, merchandising, supplier success",
  },
  {
    city: "Mumbai Studio",
    addressLine: "IndiQube, Andheri East",
    details: "Product sampling & quality lab",
  },
];

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-8 sm:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <header className="space-y-3 text-center md:text-left">
        <H1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Let’s Talk About Your Next Order
        </H1>
        <P className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto md:mx-0">
          Whether you’re sourcing a new product line, onboarding as a supplier,
          or need help with an existing order, the OpenXmart team is one message
          away.
        </P>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="py-5 sm:py-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl font-semibold">
              Direct Contacts
            </CardTitle>
            <P className="text-sm text-muted-foreground">
              Reach the right team faster with dedicated channels.
            </P>
          </CardHeader>
          <CardContent className="space-y-5 px-4 sm:px-6">
            {contactChannels.map((channel) => (
              <div
                key={channel.label}
                className="rounded-lg bg-muted/40 p-4 space-y-1"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {channel.label}
                </p>
                <p className="text-lg font-semibold">{channel.email}</p>
                <p className="text-sm text-muted-foreground">
                  {channel.phone}
                </p>
                <p className="text-xs text-muted-foreground">{channel.sla}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="py-5 sm:py-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl font-semibold">
              Response Times
            </CardTitle>
            <P className="text-sm text-muted-foreground">
              We stick to clear SLAs so you know when to expect an update.
            </P>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div>
              <H2 className="text-base font-semibold">Priority Orders</H2>
              <P className="text-sm text-muted-foreground">
                Instant call-back for delayed dispatch or in-transit issues.
              </P>
            </div>
            <div>
              <H2 className="text-base font-semibold">General Queries</H2>
              <P className="text-sm text-muted-foreground">
                Logged in our helpdesk with tracking ID shared over email.
              </P>
            </div>
            <div>
              <H2 className="text-base font-semibold">Supplier Reviews</H2>
              <P className="text-sm text-muted-foreground">
                Trust & compliance team publishes verdicts every Friday.
              </P>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card className="py-5 sm:py-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl font-semibold">
              Send Us a Message
            </CardTitle>
            <P className="text-sm text-muted-foreground">
              Share a few details and we’ll route it to the right team. Dummy
              form for layout purposes.
            </P>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form className="space-y-4" action="#">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="Jane Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="D2C Labs Pvt. Ltd." />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+91 90000 00000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">What do you need help with?</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your requirement, order ID, or product idea..."
                />
              </div>
              <Button type="submit" className="w-full md:w-auto">
                Send message
              </Button>
              <P className="text-xs text-muted-foreground">
                By submitting you agree to be contacted over email or phone by
                the OpenXmart team.
              </P>
            </form>
          </CardContent>
        </Card>

        <Card className="py-5 sm:py-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl font-semibold">
              Visit Our Studios
            </CardTitle>
            <P className="text-sm text-muted-foreground">
              Book a slot to touch and feel the latest supplier catalogues.
            </P>
          </CardHeader>
          <CardContent className="space-y-5 px-4 sm:px-6">
            {officeLocations.map((office) => (
              <div key={office.city} className="space-y-1">
                <p className="text-base font-semibold">{office.city}</p>
                <p className="text-sm text-muted-foreground">
                  {office.addressLine}
                </p>
                <p className="text-xs text-muted-foreground">{office.details}</p>
              </div>
            ))}
            <div className="rounded-md border border-dashed p-4">
              <p className="text-sm font-medium">Walk-in Hours</p>
              <p className="text-sm text-muted-foreground">
                Monday – Friday, 11 AM to 6 PM IST (appointment only).
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

