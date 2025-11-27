import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const sender = url.searchParams.get("sender");
  const receiver = url.searchParams.get("receiver");

  if (!sender || !receiver) {
    return NextResponse.json(
      { error: "Missing sender or receiver" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("chat_rooms")
    .select("id")
    .or(
      `and(sender.eq.${sender},reciever.eq.${receiver}),and(sender.eq.${receiver},reciever.eq.${sender})`
    )
    .maybeSingle(); // returns row or null, doesn't throw if multiple

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ roomId: data?.id || null }, { status: 200 });
}
