"use server";

import { UpdateProfileFormData } from "@/app/(business)/supplier/profile/[id]/edit/types";
import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { toast } from "sonner";

export const getBusiness = async (userId: string) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("supplier_businesses")
      .select("*")
      .eq("profile_id", userId)
      .single();

    if (error?.code === "404") {
      notFound();
    }

    if (!data) {
      notFound();
    }

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getBusinessById = async (id: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("supplier_businesses")
      .select("*")
      .eq("id", id)
      .single();

    if (error?.code === "404") {
      notFound();
    }

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateBusiness = async (
  id: string,
  data: UpdateProfileFormData,
  imageUrl: string
) => {
  try {
    const supabase = await createClient();

    if (data.profile_pic) {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `business-profile-avatar-${timestamp}-${randomString}`;

      const { data: imageDate, error: imageError } = await supabase.storage
        .from("business-profile-avatar")
        .upload(fileName, data.profile_pic);

      if (imageError) {
        throw imageError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("business-profile-avatar")
        .getPublicUrl(fileName);

      imageUrl = urlData.publicUrl;
    }

    const { data: updatedData, error } = await supabase
      .from("supplier_businesses")
      .update({
        business_name: data.business_name,
        business_address: data.business_address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        type: data.type,
        alternate_phone: data.alternate_phone,
        profile_avatar_url: imageUrl,
      })
      .eq("id", id)
      .single();

    if (error?.code === "404") {
      notFound();
    }

    if (error) {
      throw error;
    }

    revalidatePath("/supplier/profile");
    return { success: true, data: updatedData };
  } catch (error) {
    console.log(error);
    throw error; // Re-throw so the component can catch it
  }
};
