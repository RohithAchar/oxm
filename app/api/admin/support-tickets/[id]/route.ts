import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(_req: Request, context: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*, messages:support_ticket_messages(*)")
    .eq("id", context.params.id)
    .single();
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, ticket: data });
}

export async function PATCH(req: Request, context: any) {
  const body = await req.json();
  const supabase = await createClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: body.status, internal_notes: body.internal_notes })
    .eq("id", context.params.id);
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  // TODO: send email to user notifying status change
  return NextResponse.json({ ok: true });
}
