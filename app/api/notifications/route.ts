import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";

// GET: List notifications for current supplier (joined with receipts)
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const svc = createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Resolve supplier profile id
  const { data: business } = await supabase
    .from("supplier_businesses")
    .select("profile_id")
    .eq("profile_id", user.id)
    .single();

  if (!business) return NextResponse.json({ data: [] });
  const supplierId: string = business.profile_id ?? user.id;

  // First fetch receipts for this supplier
  const { searchParams } = new URL(req.url);
  const shouldMarkRead = searchParams.get("markRead") === "1";

  const { data: receipts, error } = await supabase
    .from("notification_receipts")
    .select("id, status, read_at, archived_at, created_at, notification_id")
    .eq("supplier_profile_id", supplierId)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const notificationIds = Array.from(
    new Set((receipts || []).map((r: any) => r.notification_id).filter(Boolean))
  );

  // Fetch notifications via service client to avoid RLS join issues
  let notificationsById: Record<string, any> = {};
  if (notificationIds.length > 0) {
    const { data: notifs, error: notifErr } = await svc
      .from("notifications")
      .select("id, title, body, type, severity, action_url, created_at")
      .in("id", notificationIds);
    if (!notifErr && notifs) {
      notificationsById = Object.fromEntries(notifs.map((n: any) => [n.id, n]));
    }
  }

  // Optionally mark unread as read when explicitly requested (page view)
  if (shouldMarkRead) {
    const unreadIds = (receipts || [])
      .filter((r: any) => !r.read_at)
      .map((r: any) => r.id);
    if (unreadIds.length > 0) {
      const now = new Date().toISOString();
      await svc
        .from("notification_receipts")
        .update({ read_at: now, status: "read" as any })
        .in("id", unreadIds);
      // Update local receipts data to reflect read status in response
      (receipts || []).forEach((r: any) => {
        if (unreadIds.includes(r.id)) {
          r.read_at = now;
          r.status = "read";
        }
      });
    }
  }

  const data = (receipts || []).map((r: any) => ({
    id: r.id,
    status: r.status,
    read_at: r.read_at,
    archived_at: r.archived_at,
    created_at: r.created_at,
    notification: notificationsById[r.notification_id] || null,
  }));

  return NextResponse.json({ data });
}

// POST: Create notification (admin) and fan-out to all suppliers
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    body: message,
    severity = "info",
    type = "system",
    action_url = null,
    recipients, // optional: array of supplier_profile_id strings; if absent, broadcast to all
  } = body || {};

  if (!title || !message) {
    return NextResponse.json(
      { error: "title and body are required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Use service client to bypass RLS for writes
  const svc = createServiceClient();
  const { data: notif, error: notifErr } = await svc
    .from("notifications")
    .insert({
      title,
      body: message,
      created_by: user.id,
      severity,
      type,
      action_url,
    })
    .select("id")
    .single();
  if (notifErr || !notif)
    return NextResponse.json(
      { error: notifErr?.message || "Insert failed" },
      { status: 500 }
    );

  let targetProfiles: string[] = [];
  if (Array.isArray(recipients) && recipients.length > 0) {
    targetProfiles = recipients.filter(
      (r: unknown): r is string => typeof r === "string"
    );
  } else {
    // Broadcast to all suppliers
    const { data: suppliers, error: supErr } = await svc
      .from("supplier_businesses")
      .select("profile_id")
      .not("profile_id", "is", null);
    if (supErr)
      return NextResponse.json({ error: supErr.message }, { status: 500 });
    targetProfiles = (suppliers || [])
      .map((s) => s.profile_id)
      .filter((id): id is string => typeof id === "string" && id.length > 0);
  }

  // Create receipts
  const rows = targetProfiles.map((profileId) => ({
    notification_id: notif.id,
    supplier_profile_id: profileId,
    status: "unread" as any,
  }));
  if (rows.length > 0) {
    const { error: recErr } = await svc
      .from("notification_receipts")
      .insert(rows);
    if (recErr)
      return NextResponse.json({ error: recErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: notif.id });
}
