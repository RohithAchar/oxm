import { Card } from "@/components/ui/card";
import Link from "next/link";
import { headers } from "next/headers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card as UICard } from "@/components/ui/card";
import { DataTable } from "./components/data.table";
import { columns, type TicketRow } from "./components/columns";

async function getTickets(params?: {
  status?: string;
  q?: string;
  from?: string;
  to?: string;
}) {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  const base = `${proto}://${host}`;
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);
  if (params?.from) qs.set("from", params.from);
  if (params?.to) qs.set("to", params.to);
  const res = await fetch(
    `${base}/api/admin/support-tickets?${qs.toString()}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [] as any[];
  const json = await res.json();
  return json.tickets as Array<{
    id: string;
    created_at: string;
    updated_at: string;
    status: string;
    subject: string;
    sender_name: string;
    sender_email: string;
  }>;
}

export default async function AdminSupportTicketsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = (await searchParams) || undefined;
  const filters = {
    status: typeof resolved?.status === "string" ? resolved?.status : undefined,
    q: typeof resolved?.q === "string" ? resolved?.q : undefined,
    from: typeof resolved?.from === "string" ? resolved?.from : undefined,
    to: typeof resolved?.to === "string" ? resolved?.to : undefined,
  };
  const tickets = await getTickets(filters);
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Support Tickets
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage supplier issues and responses.
        </p>
      </div>
      <div className="border-t" />

      <DataTable columns={columns} data={tickets as TicketRow[]} />
    </main>
  );
}
