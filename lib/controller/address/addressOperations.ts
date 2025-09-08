import { createClient } from "@/utils/supabase/server";
import {
  UserAddress,
  CreateUserAddressInput,
  UpdateUserAddressInput,
  AddressType, // Make sure this is imported
} from "@/types/address";

// Helper function to convert Supabase response to UserAddress
function convertToUserAddress(data: any): UserAddress {
  return {
    ...data,
    address_type: data.address_type as AddressType,
  };
}

function convertToUserAddresses(data: any[]): UserAddress[] {
  return data.map(convertToUserAddress);
}

export async function getUserAddresses(): Promise<UserAddress[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ? convertToUserAddresses(data) : [];
}

export async function getAddressById(id: string): Promise<UserAddress | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // No rows returned
    throw error;
  }
  return data ? convertToUserAddress(data) : null;
}

export async function createAddress(
  addressData: CreateUserAddressInput
): Promise<UserAddress> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // Get profile_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { data, error } = await supabase
    .from("user_addresses")
    .insert({
      ...addressData,
      user_id: user.id,
      profile_id: profile.id,
      country: addressData.country || "India",
    })
    .select()
    .single();

  if (error) throw error;
  return convertToUserAddress(data);
}

export async function updateAddress(
  addressData: UpdateUserAddressInput
): Promise<UserAddress> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { id, ...updateData } = addressData;
  const { data, error } = await supabase
    .from("user_addresses")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return convertToUserAddress(data);
}

export async function deleteAddress(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("user_addresses")
    .update({
      is_active: false,
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

export async function setPrimaryAddress(id: string): Promise<UserAddress> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // First, unset all primary addresses
  await supabase
    .from("user_addresses")
    .update({ is_primary: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  // Then set the selected address as primary
  const { data, error } = await supabase
    .from("user_addresses")
    .update({ is_primary: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return convertToUserAddress(data);
}

export async function setDefaultShippingAddress(
  id: string
): Promise<UserAddress> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // First, unset all default shipping addresses
  await supabase
    .from("user_addresses")
    .update({ is_default_shipping: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  // Then set the selected address as default shipping
  const { data, error } = await supabase
    .from("user_addresses")
    .update({ is_default_shipping: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return convertToUserAddress(data);
}

export async function setDefaultBillingAddress(
  id: string
): Promise<UserAddress> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  // First, unset all default billing addresses
  await supabase
    .from("user_addresses")
    .update({ is_default_billing: false })
    .eq("user_id", user.id)
    .eq("is_active", true);

  // Then set the selected address as default billing
  const { data, error } = await supabase
    .from("user_addresses")
    .update({ is_default_billing: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return convertToUserAddress(data);
}
