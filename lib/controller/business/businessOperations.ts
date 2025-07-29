"use server";

import { createClient } from "@/utils/supabase/server";

export const getBusiness = async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("supplier_businesses")
    .select("*")
    .eq("profile_id", userId)
    .single();
  if (error) {
    throw error;
  }

  return data;
};
