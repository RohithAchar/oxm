import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = String(formData.get("name") || "").slice(0, 200);
    const email = String(formData.get("email") || "").slice(0, 200);
    const subject = String(formData.get("subject") || "").slice(0, 200);
    const message = String(formData.get("message") || "").slice(0, 5000);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        subject,
        message,
        sender_name: name,
        sender_email: email,
        status: "open",
        created_by: user?.id || null,
      })
      .select("id")
      .single();
    if (error) throw error;

    // create initial message entry
    await supabase.from("support_ticket_messages").insert({
      ticket_id: data.id,
      author_role: "user",
      author_name: name,
      author_email: email,
      body: message,
    });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
