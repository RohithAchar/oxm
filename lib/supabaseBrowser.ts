import { createClient } from "@/utils/supabase/client";

export type Message = {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  created_at: string;
};

export const supabase = createClient();

export const subscribeToMessages = (
  userId: string,
  callback: (msg: Message) => void
) => {
  return supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};
