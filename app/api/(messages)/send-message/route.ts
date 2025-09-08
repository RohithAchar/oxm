// api/send-messages/route.ts
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { sender, receiver, content } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert([{ sender, receiver, content }]);

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });

  return new Response(JSON.stringify({ data }), { status: 200 });
}
