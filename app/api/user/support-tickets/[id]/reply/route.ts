import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request, context: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { body } = await req.json();
  if (!body || typeof body !== "string") {
    return NextResponse.json(
      { ok: false, error: "Invalid body" },
      { status: 400 }
    );
  }

  // Ensure ticket belongs to user
  const { data: ticket, error: tErr } = await supabase
    .from("support_tickets")
    .select("id")
    .eq("id", context.params.id)
    .eq("created_by", user.id)
    .single();
  if (tErr || !ticket) return NextResponse.json({ ok: false }, { status: 404 });

  const { error: mErr } = await supabase
    .from("support_ticket_messages")
    .insert({
      ticket_id: ticket.id,
      author_role: "user",
      author_name: user.user_metadata?.full_name || "Supplier",
      author_email: user.email || null,
      body,
    });
  if (mErr) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
