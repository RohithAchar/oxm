import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pathname = new URL(req.url).pathname;
  const parts = pathname.split("/");
  // /api/notifications/[id]/read -> ['', 'api', 'notifications', '{id}', 'read']
  const notificationId: string | undefined = parts[3];
  if (!notificationId) {
    return NextResponse.json(
      { error: "Invalid notification id" },
      { status: 400 }
    );
  }

  // Find receipt for this user
  const { data: receipt, error } = await supabase
    .from("notification_receipts")
    .select("id")
    .eq("notification_id", notificationId)
    .eq("supplier_profile_id", user.id)
    .single();
  if (error || !receipt)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error: updErr } = await supabase
    .from("notification_receipts")
    .update({ read_at: new Date().toISOString(), status: "read" as any })
    .eq("id", receipt.id);
  if (updErr)
    return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
