import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const q = url.searchParams.get("q");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const supabase = await createClient();
  let query = supabase
    .from("support_tickets")
    .select(
      "id, created_at, updated_at, status, subject, sender_name, sender_email"
    )
    .order("created_at", { ascending: false });

  if (status && ["open", "pending", "closed"].includes(status)) {
    // @ts-ignore
    query = query.eq("status", status);
  }
  if (from) {
    // @ts-ignore
    query = query.gte("created_at", from);
  }
  if (to) {
    // @ts-ignore
    query = query.lte("created_at", to);
  }
  if (q) {
    // @ts-ignore
    query = query.or(
      `subject.ilike.%${q}%,sender_name.ilike.%${q}%,sender_email.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, tickets: data });
}
