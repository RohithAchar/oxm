"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SupplierTicketDetail({ params }: any) {
  const [ticket, setTicket] = useState<any>(null);
  const [reply, setReply] = useState("");
  const id = params.id;

  async function load() {
    const res = await fetch(`/api/user/support-tickets/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return;
    const json = await res.json();
    setTicket(json.ticket);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function sendReply() {
    // Optionally: send reply via same API as admin reply, but mark author_role=user
    // For now: post to admin reply endpoint and let backend infer author
    await fetch(`/api/admin/support-tickets/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply }),
    });
    setReply("");
    await load();
  }

  if (!ticket) return null;

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <h1 className="text-xl md:text-2xl font-semibold">Ticket</h1>
      <Card className="p-4 space-y-2">
        <div className="text-sm text-muted-foreground">
          {ticket.status.toUpperCase()} •{" "}
          {new Date(ticket.created_at).toLocaleString()}
        </div>
        <div className="font-medium">{ticket.subject}</div>
        <div className="mt-2 whitespace-pre-line">{ticket.message}</div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="font-medium">Messages</div>
        <div className="space-y-2">
          {(ticket.messages || []).map((m: any) => (
            <div key={m.id} className="border rounded p-2">
              <div className="text-xs text-muted-foreground">
                {m.author_role} • {new Date(m.created_at).toLocaleString()}
              </div>
              <div className="whitespace-pre-line text-sm">{m.body}</div>
            </div>
          ))}
        </div>
        <div>
          <label className="text-sm">Reply</label>
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={4}
          />
          <Button className="mt-2" onClick={sendReply} disabled={!reply.trim()}>
            Send
          </Button>
        </div>
      </Card>
    </main>
  );
}
