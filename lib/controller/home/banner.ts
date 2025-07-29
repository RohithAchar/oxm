"use server";

import { createClient } from "@/utils/supabase/server";

export const getBanners = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("banners").select("*");
  if (error) {
    throw error;
  }
  return data;
};
