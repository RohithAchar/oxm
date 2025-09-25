import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: true, tickets: [] });
  const { data, error } = await supabase
    .from("support_tickets")
    .select("id, created_at, status, subject")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, tickets: data });
}
