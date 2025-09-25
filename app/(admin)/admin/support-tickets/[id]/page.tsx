"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function TicketDetailPage({ params }: any) {
  const [ticket, setTicket] = useState<any>(null);
  const [status, setStatus] = useState<string>("open");
  const [notes, setNotes] = useState<string>("");
  const [reply, setReply] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const id = params.id;

  async function load() {
    const res = await fetch(`/api/admin/support-tickets/${id}`, {
      cache: "no-store",
    });
    const json = await res.json();
    setTicket(json.ticket);
    setStatus(json.ticket.status);
    setNotes(json.ticket.internal_notes || "");
  }

  useEffect(() => {
    load();
  }, [id]);

  async function saveStatus() {
    try {
      setSaving(true);
      await fetch(`/api/admin/support-tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internal_notes: notes }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function sendReply() {
    try {
      setSending(true);
      await fetch(`/api/admin/support-tickets/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: reply }),
      });
      setReply("");
      await load();
    } finally {
      setSending(false);
    }
  }

  if (!ticket) return null;

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Support Ticket
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Review details, reply, and update status.
        </p>
      </div>
      <div className="border-t" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left: Details + Messages */}
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">
                {ticket.subject}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                {ticket.status.toUpperCase()} •{" "}
                {new Date(ticket.created_at).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {ticket.sender_name} • {ticket.sender_email}
              </div>
              <div className="pt-2 whitespace-pre-line text-sm md:text-base">
                {ticket.message}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 max-h-[50vh] overflow-auto pr-1">
                {(ticket.messages || []).map((m: any) => (
                  <div key={m.id} className="border rounded p-2">
                    <div className="text-xs text-muted-foreground">
                      {m.author_role} •{" "}
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                    <div className="whitespace-pre-line text-sm">{m.body}</div>
                  </div>
                ))}
                {(ticket.messages || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No messages yet.
                  </div>
                ) : null}
              </div>
              <div>
                <label className="text-sm">Reply to user</label>
                <Textarea
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  disabled={sending}
                />
                <div className="flex justify-end">
                  <Button
                    className="mt-2"
                    onClick={sendReply}
                    disabled={!reply.trim() || sending}
                  >
                    {sending ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions */}
        <div className="lg:col-span-4">
          <Card className="lg:sticky lg:top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">
                Ticket Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm">Status</label>
                <select
                  className="border rounded px-2 py-2 w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={saving}
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
                <div className="flex justify-end">
                  <Button onClick={saveStatus} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Internal notes</label>
                <Textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={saving}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
