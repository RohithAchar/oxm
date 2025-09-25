"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Textarea } from "@/components/ui/textarea";

export default function TicketPopover({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<any>(null);
  const [sending, setSending] = useState(false);

  async function load() {
    const res = await fetch(`/api/user/support-tickets/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const json = await res.json();
    setTicket(json.ticket);
  }

  useEffect(() => {
    let interval: any;
    if (open) {
      load();
      interval = setInterval(load, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [open]);

  async function sendReply(body: string) {
    try {
      setSending(true);
      await fetch(`/api/user/support-tickets/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      await load();
    } finally {
      setSending(false);
    }
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        {!ticket ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {ticket.status?.toUpperCase()} •{" "}
              {new Date(ticket.created_at).toLocaleString()}
            </div>
            <div className="font-medium">{ticket.subject}</div>
            <div className="max-h-48 overflow-auto space-y-2">
              {[...(ticket.messages || [])]
                .sort(
                  (a: any, b: any) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                )
                .map((m: any) => (
                  <div key={m.id} className="border rounded p-2">
                    <div className="text-xs text-muted-foreground">
                      {m.author_role} •{" "}
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                    <div className="whitespace-pre-line text-sm">{m.body}</div>
                  </div>
                ))}
            </div>
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget as HTMLFormElement);
                const val = String(fd.get("reply") || "").trim();
                if (!val) return;
                await sendReply(val);
                (e.currentTarget as HTMLFormElement).reset();
              }}
            >
              <input
                name="reply"
                placeholder="Type a reply"
                className="flex-1 border rounded px-2 py-1 text-sm"
                disabled={sending}
              />
              <Button type="submit" size="sm" disabled={sending}>
                {sending ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
