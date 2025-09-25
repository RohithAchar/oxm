import { Card } from "@/components/ui/card";

async function getMyTickets() {
  const res = await fetch(`/api/user/support-tickets`, { cache: "no-store" });
  if (!res.ok) return [] as any[];
  const json = await res.json();
  return json.tickets as any[];
}

export default async function SupplierTicketsPage() {
  const tickets = await getMyTickets();
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <h1 className="text-xl md:text-2xl font-semibold">
        Your Support Tickets
      </h1>
      <div className="grid grid-cols-1 gap-3">
        {tickets.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="text-sm text-muted-foreground">
              {t.status.toUpperCase()} •{" "}
              {new Date(t.created_at).toLocaleString()}
            </div>
            <div className="font-medium">{t.subject}</div>
          </Card>
        ))}
        {tickets.length === 0 ? (
          <Card className="p-4">No tickets yet.</Card>
        ) : null}
      </div>
    </main>
  );
}
