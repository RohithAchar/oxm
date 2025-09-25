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
  // supplier replies disabled

  async function load() {
    const res = await fetch(`/api/user/support-tickets/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const json = await res.json();
    setTicket(json.ticket);
  }

  useEffect(() => {
    if (open && !ticket) {
      load();
    }
  }, [open]);

  // reply disabled

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
              {(ticket.messages || []).map((m: any) => (
                <div key={m.id} className="border rounded p-2">
                  <div className="text-xs text-muted-foreground">
                    {m.author_role} • {new Date(m.created_at).toLocaleString()}
                  </div>
                  <div className="whitespace-pre-line text-sm">{m.body}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
