"use server";

import { productFormSchema } from "@/components/product/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import z from "zod";

const toPaise = (price: number) => Math.round(price * 100);
const toRupee = (price: number) => Math.round(price / 100).toFixed(2);

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
      price_per_unit: toRupee(product.price_per_unit || 0),
      total_price: toRupee(product.total_price || 0),
      imageUrl: imageUrls[idx] || null,
      priceAndQuantity:
        priceAndQuantityData[idx]?.map((tier) => ({
          ...tier,
          price: toRupee(tier.price),
        })) || [],
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

    // STEP 1: Insert the basic product with dropship fields
    const { data: productData, error } = await supabase
      .from("products")
      .insert({
        supplier_id: supplierId,
        category_id: product.categoryId,
        name: product.name,
        description: product.description,
        is_sample_available: product.sample_available,
        is_active: product.is_active,
        hsn_code: product.hsn_code || null,
        brand: product.brand,
        country_of_origin: product.country_of_origin,
        subcategory_id: product.subCategoryId,
        youtube_link: product.youtube_link || null,
        length: product.length || null,
        breadth: product.breadth || null,
        height: product.height || null,
        weight: product.weight || null,
        quantity: product.quantity || null,
        price_per_unit: toPaise(product.price_per_unit!),
        total_price: toPaise(product.total_price!),
        is_bulk_pricing: product.is_bulk_pricing || null,

        // NEW FIELDS
        dropship_available: product.dropship_available ?? false,
        dropship_price: product.dropship_price
          ? toPaise(product.dropship_price)
          : null,
        white_label_shipping: product.white_label_shipping ?? false,
        dispatch_time: product.dispatch_time || null,
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    // STEP 2: Handle Tags
    if (product.tags && product.tags.length > 0) {
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", product.tags);

      const existingTagMap = new Map(
        existingTags?.map((tag) => [tag.name, tag.id]) || []
      );

      const newTags = product.tags.filter(
        (tagName) => !existingTagMap.has(tagName)
      );

      if (newTags.length > 0) {
        const { data: createdTags, error: tagError } = await supabase
          .from("tags")
          .insert(newTags.map((name) => ({ name })))
          .select("id, name");

        if (tagError) throw tagError;

        createdTags?.forEach((tag) => existingTagMap.set(tag.name, tag.id));
      }

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

    // STEP 3: Handle Images
    const handleImages = async () => {
      if (!product.images || product.images.length === 0) return;

      const imagePromises = product.images.map(async (file) => {
        if (file.image !== undefined) {
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileName = `product-image-${timestamp}-${randomString}`;

          const { error } = await supabase.storage
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

      if (imageResults.length > 0) {
        await supabase.from("product_images").insert(imageResults);
      }
    };

    // STEP 4: Handle Tier Pricing
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
          price: toPaise(tier.price),
        }));

      if (tierData.length > 0) {
        await supabase.from("product_tier_pricing").insert(tierData);
      }
    };

    // STEP 5: Handle Specifications
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

    // STEP 6: Parallel execution
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

interface ProductParams {
  page: number;
  page_size: number;
  dropship_available?: boolean;
}

export const getProducts = async (params: ProductParams) => {
  try {
    const supabase = await createClient();

    // Convert page & page_size into start/end indexes
    const from = (params.page - 1) * params.page_size;
    const to = from + params.page_size - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" }) // count helps for total pages
      .order("created_at", { ascending: false })
      .range(from, to);

    if (params.dropship_available) {
      query = query.eq("dropship_available", true);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    let [images, pricesAndQuantities] = await Promise.all([
      Promise.all(data.map((product) => getProductMainImageUrl(product.id))),
      Promise.all(data.map((product) => getPricesAndQuantities(product.id))),
    ]);

    return {
      products: data.map((product, idx) => ({
        ...product,
        imageUrl: images[idx],
        price_per_unit: toRupee(product.price_per_unit || 0),
        total_price: toRupee(product.total_price || 0),
        priceAndQuantity:
          pricesAndQuantities[idx]?.map((tier) => ({
            ...tier,
            price: toRupee(tier.price),
          })) || [],
      })),
      total: count ?? 0,
      page: params.page,
      page_size: params.page_size,
      total_pages: count ? Math.ceil(count / params.page_size) : 0,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get products");
  }
};
