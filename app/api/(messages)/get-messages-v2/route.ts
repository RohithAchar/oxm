import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId");

  const supabase = await createClient();

  if (!roomId) {
    return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform database data to match ChatMessage interface
  const transformedMessages = (data || []).map((message) => ({
    id: message.id,
    content: message.content,
    user: {
      name: message.user_name,
    },
    createdAt: message.created_at || new Date().toISOString(),
    saved: true, // Messages from database are already saved
  }));

  return NextResponse.json(transformedMessages, { status: 200 });
}
