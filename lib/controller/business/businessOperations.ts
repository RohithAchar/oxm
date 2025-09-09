"use server";

import { createBusinessformSchema } from "@/app/(business)/create-business/types";
import { UpdateProfileFormData } from "@/app/(business)/supplier/profile/[id]/edit/types";
import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import z from "zod";

type Business = Database["public"]["Tables"]["supplier_businesses"]["Row"];

export const getBusiness = async (userId: string): Promise<Business> => {
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
    console.error(error);
    throw new Error("Failed to fetch business"); // Ensure function always throws or returns a Business
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
        phone: Number(data.main_phone),
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
      main_phone: data.main_phone,
      alternative_phone: data.alternative_phone,
      gstNumber: data.gstNumber,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      businessAddress: data.businessAddress,
      profile_pic: data.profile_pic,
      gst_certificate: data.gst_certificate,
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

    // Upload GST certificate and get the public URL
    let gstCertificateUrl = null;
    if (data.gst_certificate) {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = data.gst_certificate.name.split('.').pop();
      const fileName = `gst-certificate-${timestamp}-${randomString}.${fileExtension}`;

      const { data: gstData, error: gstError } = await supabase.storage
        .from("gst-certificates")
        .upload(fileName, data.gst_certificate);

      if (gstError) {
        throw gstError;
      }

      // Get the public URL
      const { data: gstUrlData } = supabase.storage
        .from("gst-certificates")
        .getPublicUrl(fileName);

      gstCertificateUrl = gstUrlData.publicUrl;
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
        gst_certificate_url: gstCertificateUrl,
        gst_number: data.gstNumber,
        phone: Number(data.main_phone),
        is_verified: false,
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
    .select("is_verified")
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

  return data.is_verified || false;
};
