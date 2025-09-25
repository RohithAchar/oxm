"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Sparkles,
  BookOpenCheck,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Rocket,
  PartyPopper,
} from "lucide-react";

export default function SupplierTipsPage() {
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Supplier Tips
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Learn how to grow on OpenXmart with practical, step-by-step guidance.
        </p>
      </div>
      <div className="border-t" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="hover:bg-muted/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              Basic Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Get started with listing quality, images, and descriptions.
            </p>
            <Button asChild variant="secondary" className="shrink-0">
              <Link href="/supplier/tips/basic-guidelines">
                Open
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Pricing Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Price smartly to convert more enquiries into orders.
            </p>
            <Button asChild variant="secondary" className="shrink-0">
              <Link href="/supplier/tips/pricing-guidelines">
                Open
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-muted/40 p-3 md:p-4 flex items-center justify-between gap-3">
        <p className="text-sm md:text-base">
          Learn how to supply and grow your business on OpenXmart
        </p>
        <Button asChild variant="default" className="h-8 md:h-9">
          <Link
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Play className="mr-2 h-4 w-4" />
            YouTube link
          </Link>
        </Button>
      </div>

      <section className="rounded-xl border bg-card/50 p-4 md:p-6 space-y-4 md:space-y-5">
        <h2 className="text-base md:text-lg font-semibold">What you’ll get</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <li className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/40 transition-colors">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Better product presentation</p>
              <p className="text-sm text-muted-foreground">
                Images, titles, descriptions that convert.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/40 transition-colors">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Convert more enquiries</p>
              <p className="text-sm text-muted-foreground">
                Fast replies and quote templates that win.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/40 transition-colors">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Build buyer trust</p>
              <p className="text-sm text-muted-foreground">
                Transparent policies and on-time delivery.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/40 transition-colors">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Growth insights</p>
              <p className="text-sm text-muted-foreground">
                Use trust stamps, premium listings, SEO.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3 p-3 rounded-md bg-muted/30 hover:bg-muted/40 transition-colors md:col-span-2">
            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Rocket className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Stay competitive</p>
              <p className="text-sm text-muted-foreground">
                Latest trends and best practices, simplified.
              </p>
            </div>
          </li>
        </ul>

        <div className="flex items-center justify-between gap-3 p-3 md:p-4 rounded-md bg-primary/5 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <PartyPopper className="h-4 w-4" />
            <p className="text-sm md:text-base font-medium">
              Ready to level up?
            </p>
          </div>
          <Button asChild size="sm" variant="secondary">
            <a href="#" onClick={(e) => e.preventDefault()}>
              Start with Basic Guidelines
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
}
