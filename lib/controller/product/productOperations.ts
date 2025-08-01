"use server";

import { createClient } from "@/utils/supabase/server";

export const getLatestProducts = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Fetch image URLs for each product in parallel
  const imageUrlPromises = data.map((product) =>
    getProductMainImageUrl(product.id).catch(() => null)
  );
  const imageUrls = await Promise.all(imageUrlPromises);
  if (imageUrls.some((url) => !url)) {
    throw new Error("Failed to fetch product images");
  }

  // Price and quantity data
  const priceAndQuantityPromises = data.map((product) =>
    getPricesAndQuantities(product.id).catch(() => null)
  );
  const priceAndQuantityData = await Promise.all(priceAndQuantityPromises);
  if (priceAndQuantityData.some((data) => !data)) {
    throw new Error("Failed to fetch product prices and quantities");
  }

  return data.map((product, idx) => {
    return {
      ...product,
      imageUrl: imageUrls[idx] || null,
      priceAndQuantity: priceAndQuantityData[idx] || [],
    };
  });
};

export const getProductMainImageUrl = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("display_order", { ascending: true })
    .limit(1);

  if (error) {
    throw error;
  }
  return data[0].image_url;
};

export const getPricesAndQuantities = async (id: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_tier_pricing")
    .select("*")
    .eq("product_id", id)
    .order("quantity", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};
