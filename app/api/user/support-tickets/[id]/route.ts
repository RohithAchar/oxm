import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(_req: Request, context: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });

  const { data, error } = await supabase
    .from("support_tickets")
    .select("*, messages:support_ticket_messages(*)")
    .eq("id", context.params.id)
    .eq("created_by", user.id)
    .single();
  if (error || !data) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, ticket: data });
}
