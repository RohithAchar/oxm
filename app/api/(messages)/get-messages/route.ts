// api/get-messages/route.ts
import { getProfile } from "@/lib/controller/user/userOperations";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user1 = url.searchParams.get("user1")!;
  const user2 = url.searchParams.get("user2")!;

  const supabase = await createClient();

  // Fetch sender and receiver profiles
  const sender = await getProfile(user1);
  const receiver = await getProfile(user2);

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender.eq.${user1},receiver.eq.${user2}),and(sender.eq.${user2},receiver.eq.${user1})`
    )
    .order("created_at", { ascending: true });

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });

  // ✅ Wrap messages + profiles together
  return new Response(
    JSON.stringify({
      messages: data, // same format as before
      sender, // sender profile
      receiver, // receiver profile
    }),
    { status: 200 }
  );
}
