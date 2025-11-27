import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sender, receiver } = await req.json();
  const supabase = await createClient();

  if (!sender) {
    return NextResponse.json({ error: "sender is required" }, { status: 400 });
  }

  if (!receiver) {
    return NextResponse.json(
      { error: "receiver is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("chat_rooms")
    .insert({
      sender: sender,
      reciever: receiver,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data.id, { status: 201 });
}
