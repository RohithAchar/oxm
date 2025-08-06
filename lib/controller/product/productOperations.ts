"use server";

import { productFormSchema } from "@/components/product/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
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

    // STEP 1: Insert the basic product (same as before)
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
        length: product.length,
        breadth: product.breadth,
        height: product.height,
        weight: product.weight,
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    // STEP 2: Handle Tags (OPTIMIZED - bulk operations instead of individual queries)
    if (product.tags && product.tags.length > 0) {
      // Get all existing tags in ONE query instead of multiple
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", product.tags);

      const existingTagMap = new Map(
        existingTags?.map((tag) => [tag.name, tag.id]) || []
      );

      // Find which tags need to be created
      const newTags = product.tags.filter(
        (tagName) => !existingTagMap.has(tagName)
      );

      // Create all new tags in ONE query instead of multiple
      if (newTags.length > 0) {
        const { data: createdTags, error: tagError } = await supabase
          .from("tags")
          .insert(newTags.map((name) => ({ name })))
          .select("id, name");

        if (tagError) throw tagError;

        // Add new tags to our map
        createdTags?.forEach((tag) => existingTagMap.set(tag.name, tag.id));
      }

      // Link ALL tags to product in ONE query instead of multiple
      const productTags = product.tags
        .map((tagName) => {
          const tagId = existingTagMap.get(tagName);
          return tagId
            ? {
                product_id: productData.id,
                tag_id: tagId,
              }
            : null;
        })
        .filter(
          (pt): pt is { product_id: string; tag_id: string } => pt !== null
        );

      if (productTags.length > 0) {
        const { error: linkError } = await supabase
          .from("product_tags")
          .insert(productTags);

        if (linkError) throw linkError;
      }
    }

    // STEP 3: Handle Images (same as before, but in parallel)
    const handleImages = async () => {
      if (!product.images || product.images.length === 0) return;

      const imagePromises = product.images.map(async (file, idx) => {
        if (file.image !== undefined) {
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileName = `product-image-${timestamp}-${randomString}`;

          const { data, error } = await supabase.storage
            .from("product-images")
            .upload(fileName, file.image);

          if (error) {
            console.error("Upload error:", error);
            return null;
          }

          const { data: publicUrl } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

          return {
            product_id: productData.id,
            image_url: publicUrl.publicUrl,
            display_order: file.display_order,
          };
        }
        return null;
      });

      const imageResults = (await Promise.all(imagePromises)).filter(
        (
          result
        ): result is {
          product_id: string;
          image_url: string;
          display_order: number;
        } => result !== null
      );

      // Insert ALL images in ONE query instead of multiple
      if (imageResults.length > 0) {
        await supabase.from("product_images").insert(imageResults);
      }
    };

    // STEP 4: Handle Tier Pricing (OPTIMIZED - bulk insert)
    const handleTiers = async () => {
      if (!product.tiers || product.tiers.length === 0) return;

      const tierData = product.tiers
        .filter(
          (tier): tier is typeof tier & { qty: number; price: number } =>
            tier.qty != null &&
            tier.price != null &&
            tier.qty > 0 &&
            tier.price > 0
        )
        .map((tier) => ({
          product_id: productData.id,
          quantity: tier.qty,
          price: tier.price,
        }));

      if (tierData.length > 0) {
        await supabase.from("product_tier_pricing").insert(tierData);
      }
    };

    // STEP 5: Handle Specifications (OPTIMIZED - bulk insert)
    const handleSpecs = async () => {
      if (!product.specifications || product.specifications.length === 0)
        return;

      const specData = product.specifications
        .filter(
          (
            spec
          ): spec is typeof spec & { spec_name: string; spec_value: string } =>
            spec.spec_name != null &&
            spec.spec_value != null &&
            spec.spec_name.trim() !== "" &&
            spec.spec_value.trim() !== ""
        )
        .map((spec) => ({
          product_id: productData.id,
          spec_name: spec.spec_name,
          spec_value: spec.spec_value,
          spec_unit: spec.spec_unit,
        }));

      if (specData.length > 0) {
        await supabase.from("product_specifications").insert(specData);
      }
    };

    // STEP 6: Run images, tiers, and specs in parallel (MAJOR OPTIMIZATION)
    await Promise.all([handleImages(), handleTiers(), handleSpecs()]);

    revalidatePath("/supplier/profile");
    return productData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to add product");
  }
};

export const getTags = async () => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from("tags").select("*");

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get tags");
  }
};
