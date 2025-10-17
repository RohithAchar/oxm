import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

async function sendEmailStub(to: string, subject: string, html: string) {
  return true;
}

export async function POST(req: Request, context: any) {
  const { body, subject } = await req.json();
  const supabase = await createClient();

  const { data: ticket, error: tErr } = await supabase
    .from("support_tickets")
    .select("id, sender_email, sender_name, subject")
    .eq("id", context.params.id)
    .single();
  if (tErr || !ticket) return NextResponse.json({ ok: false }, { status: 404 });

  await sendEmailStub(
    ticket.sender_email,
    subject || `Re: ${ticket.subject}`,
    body
  );

  const { error: mErr } = await supabase
    .from("support_ticket_messages")
    .insert({
      ticket_id: ticket.id,
      author_role: "admin",
      author_name: "Support",
      author_email: "support@openxmart.com",
      body,
    });
  if (mErr) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
