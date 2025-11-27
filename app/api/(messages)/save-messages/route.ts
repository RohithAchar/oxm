import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { chatRoomId, content, username } = await request.json();
    if (!chatRoomId || !content || !username) {
      return new Response("Missing required fields", { status: 400 });
    }
    const supabase = await createClient();

    await supabase.from("chat_messages").insert({
      chat_room_id: chatRoomId,
      content: content,
      user_name: username,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error saving messages:", error);
    return new Response("Error saving messages", { status: 500 });
  }
}
