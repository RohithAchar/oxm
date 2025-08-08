"use server";

import { BannerFormSchema } from "@/app/(admin)/admin/banner/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import z from "zod";

export const createBanner = async (
  bannerData: z.infer<typeof BannerFormSchema>
) => {
  const supabase = await createClient();
  try {
    const validation = BannerFormSchema.safeParse(bannerData);
    if (!validation.success) {
      throw validation.error;
    }

    // Generate a unique file name for the uploaded image
    const fileName = `banner-${Date.now()}.${
      validation.data.image.name.split(".")[1]
    }`;
    await supabase.storage
      .from("banner-uploads")
      .upload(fileName, validation.data.image);

    //  get public URL for the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("banner-uploads").getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("banners")
      .insert({
        title: validation.data.title,
        alt_text: validation.data.alt_text,
        is_active: validation.data.is_active,
        link_url: validation.data.link_url,
        start_at: validation.data.start_at,
        end_at: validation.data.end_at,
        image_url: publicUrl,
        click_count: 0,
        impression_count: 0,
      })
      .select("*")
      .single();

    revalidatePath("/admin/banner");
    return null;
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
};

export const getBanners = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("banners").select("*");
  if (error) {
    throw error;
  }
  return data;
};

export const toggleBanner = async (id: string, currentStatus: boolean) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .update({ is_active: !currentStatus })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/admin/banner");
  return data;
};
