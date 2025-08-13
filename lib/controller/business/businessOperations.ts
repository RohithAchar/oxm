"use server";

import { createBusinessformSchema } from "@/app/(business)/create-business/types";
import { UpdateProfileFormData } from "@/app/(business)/supplier/profile/[id]/edit/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import z from "zod";

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
    throw error;
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

export const isBusinessExists = async (profileId: string): Promise<boolean> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("supplier_businesses")
    .select("*")
    .eq("profile_id", profileId)
    .single();

  if (error?.code === "404") {
    return false;
  }

  if (error?.code === "PGRST116") {
    return false;
  }

  if (error) {
    throw error;
  }

  return data !== null;
};

export const createBusiness = async (
  userId: string,
  data: z.infer<typeof createBusinessformSchema>
) => {
  try {
    const supabase = await createClient();

    const validatedFields = createBusinessformSchema.safeParse({
      businessName: data.businessName,
      alternative_phone: data.alternative_phone,
      gstNumber: data.gstNumber,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      businessAddress: data.businessAddress,
      profile_pic: data.profile_pic,
      type: data.type,
    });

    if (!validatedFields.success) {
      throw validatedFields.error;
    }

    // Upload profile picture and get the public URL
    let imageUrl = null;
    if (data.profile_pic) {
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

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Insert data into the database
    const { data: business, error } = await supabase
      .from("supplier_businesses")
      .insert({
        profile_id: userId,
        business_name: data.businessName,
        business_address: data.businessAddress,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        type: data.type,
        alternate_phone: data.alternative_phone,
        profile_avatar_url: imageUrl,
        gst_number: data.gstNumber,
        phone: Number(profile.phone_number),
      })
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/supplier/profile");
    return business;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const isBusinessVerified = async (
  supplierId: string
): Promise<boolean> => {
  const supabase = await createClient();

  const { data: user, error: businessError } = await supabase
    .from("supplier_businesses")
    .select("id")
    .eq("profile_id", supplierId)
    .single();

  if (businessError?.code === "404") {
    return false;
  }

  if (businessError?.code === "PGRST116") {
    return false;
  }

  if (businessError) {
    throw businessError;
  }

  const { data, error } = await supabase
    .from("supplier_businesses")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error?.code === "404") {
    return false;
  }

  if (error?.code === "PGRST116") {
    return false;
  }

  if (error) {
    throw error;
  }

  return data !== null;
};
