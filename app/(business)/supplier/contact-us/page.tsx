"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SupportCards from "@/components/support/SupportCards";
import { DataTable } from "./components/data.table";
import { columns, type SupplierTicketRow } from "./components/columns";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  async function loadTickets() {
    try {
      const res = await fetch("/api/user/support-tickets", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      setTickets(json.tickets || []);
    } catch {}
  }

  useEffect(() => {
    loadTickets();
  }, []);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/support/ticket", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to submit");
      setStatus("Submitted. We'll get back within 24 hours.");
      await loadTickets();
    } catch (e) {
      setStatus(
        "Something went wrong. Please try again or email support@openxmart.com."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Contact Us
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              For issues not covered in the Help Center, contact our support
              team.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t" />

      <SupportCards />

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Your Recent Tickets</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Track status of issues you raised.
        </p>
        <DataTable columns={columns} data={tickets as SupplierTicketRow[]} />
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold">Send us a message</h2>
        <p className="text-sm text-muted-foreground">
          We respond within 24 hours on working days.
        </p>
        <form action={onSubmit} className="mt-3 space-y-3">
          <div>
            <label className="text-sm">Your name</label>
            <Input name="name" required placeholder="John Doe" />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              type="email"
              required
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="text-sm">Subject</label>
            <Input name="subject" required placeholder="Brief subject" />
          </div>
          <div>
            <label className="text-sm">Message</label>
            <Textarea
              name="message"
              required
              placeholder="Describe your issue"
              rows={5}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </Button>
          {status ? (
            <p className="text-sm text-muted-foreground">{status}</p>
          ) : null}
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          Prefer email? Write to{" "}
          <a
            href="mailto:support@openxmart.com"
            className="text-primary underline"
          >
            support@openxmart.com
          </a>
        </p>
      </Card>
    </main>
  );
}
