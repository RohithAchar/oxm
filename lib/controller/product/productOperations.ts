"use server";

import { productFormSchema } from "@/components/product/types";
import { createClient } from "@/utils/supabase/server";
import z from "zod";

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

export const addProduct = async (
  supplierId: string,
  product: z.infer<typeof productFormSchema>
) => {
  try {
    const supabase = await createClient();
    const validation = productFormSchema.safeParse(product);
    if (!validation.success) {
      throw validation.error;
    }

    // Basic product data
    const { data: productData, error } = await supabase
      .from("products")
      .insert({
        supplier_id: supplierId,
        category_id: product.categoryId,
        name: product.name,
        description: product.description,
        is_sample_available: product.sample_available,
        is_active: product.is_active,
        hsn_code: product.hsn_code,
        brand: product.brand,
        country_of_origin: product.country_of_origin,
        subcategory_id: product.subCategoryId,
        youtube_link: product.youtube_link,
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    // Images
    const imagePromise = product.images.map(async (file, idx) => {
      if (file.image !== undefined) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `product-image-${timestamp}-${randomString}`;

        // Upload the file
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(fileName, file.image);

        if (error) {
          console.error("Upload error:", error);
          return null;
        }

        // Get public URL
        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        return {
          url: publicUrl.publicUrl,
          display_order: file.display_order,
        };
      }
      return null;
    });
    const imageResults = (await Promise.all(imagePromise)).filter(Boolean);

    await Promise.all(
      imageResults.map((result) => {
        if (!result) return;
        return supabase.from("product_images").insert({
          product_id: productData.id,
          image_url: result.url,
          display_order: result.display_order,
        });
      })
    );

    // Tier pricing
    await Promise.all(
      product.tiers.map((tier) => {
        return supabase.from("product_tier_pricing").insert({
          product_id: productData.id,
          quantity: tier.qty,
          price: tier.price,
          is_active: tier.isActive,
          height: tier.height,
          weight: tier.weight,
          length: tier.length,
          breadth: tier.breadth,
        });
      })
    );

    if (product.specifications && product.specifications.length > 0) {
      await Promise.all(
        product.specifications.map((spec) => {
          if (!spec.spec_name || !spec.spec_value) return;
          return supabase.from("product_specifications").insert({
            product_id: productData.id,
            spec_name: spec.spec_name,
            spec_value: spec.spec_value,
            spec_unit: spec.spec_unit,
          });
        })
      );
    }

    return productData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add product");
  }
};
