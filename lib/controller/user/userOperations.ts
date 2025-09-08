"use server";

import { createClient } from "@/utils/supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data;
};

export const getUserId = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  if (!data.user) {
    throw new Error("User not found");
  }
  return data.user.id;
};

export const getProfile = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

interface AllUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}
export const getAllUsersChat = async ({
  myId,
}: {
  myId: string;
}): Promise<AllUser[]> => {
  try {
    const supabase = await createClient();

    const { data: recieversId, error: recieversError } = await supabase.rpc(
      "get_distinct_receivers",
      { sender_id: myId }
    );

    if (recieversError) {
      throw recieversError;
    }

    const ids = recieversId.map((msg) => msg.receiver);
    const { data: recivers, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", ids);

    return recivers || [];
  } catch (error) {
    throw error;
  }
};
