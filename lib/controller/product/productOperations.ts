"use server";

import z from "zod";
import { revalidatePath } from "next/cache";
import { cache } from "react";

import { productFormSchema } from "@/components/product/types";
import { createClient } from "@/utils/supabase/server";
import {
  getBusiness,
  isBusinessVerified,
} from "../business/businessOperations";

// Constants
const PRICE_MULTIPLIER = 100;
const DEFAULT_PRODUCT_LIMIT = 6;

// Utility functions
const toPaise = (price: number) => Math.round(price * PRICE_MULTIPLIER);
const toRupee = (price: number) => (price / PRICE_MULTIPLIER).toFixed(2);

// Type definitions for better type safety
interface ProductWithMetadata {
  id: string;
  supplier_id: string | null;
  price_per_unit?: number | null;
  total_price?: number | null;
  created_at: string | null;
  [key: string]: any;
}

interface EnrichedProduct
  extends Omit<ProductWithMetadata, "price_per_unit" | "total_price"> {
  is_verified: boolean;
  price_per_unit: string;
  total_price: string;
  imageUrl: string | null;
  priceAndQuantity: Array<{
    id: string;
    quantity: number;
    price: string;
    [key: string]: any;
  }>;
}

// Optimized function to fetch multiple products with all metadata in parallel
const fetchProductsWithMetadata = async (products: ProductWithMetadata[]) => {
  const [imageUrls, priceAndQuantityData, isVerifiedData] = await Promise.all([
    // Fetch all images in parallel
    Promise.all(
      products.map((product) =>
        getProductMainImageUrl(product.id).catch(() => null)
      )
    ),
    // Fetch all pricing data in parallel
    Promise.all(
      products.map((product) =>
        getPricesAndQuantities(product.id).catch(() => null)
      )
    ),
    // Fetch all verification statuses in parallel
    Promise.all(
      products.map((product) =>
        isBusinessVerified(product.supplier_id!).catch(() => null)
      )
    ),
  ]);

  // Validate that all data was fetched successfully
  if (imageUrls.some((url) => url === null)) {
    throw new Error("Failed to fetch product images");
  }
  if (priceAndQuantityData.some((data) => data === null)) {
    throw new Error("Failed to fetch product prices and quantities");
  }
  if (isVerifiedData.some((data) => data === null)) {
    throw new Error("Failed to fetch supplier verification status");
  }

  return { imageUrls, priceAndQuantityData, isVerifiedData };
};

export const getLatestProducts = async (): Promise<EnrichedProduct[]> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(DEFAULT_PRODUCT_LIMIT);

    if (error) throw error;
    if (!data || data.length === 0) return [];

    const { imageUrls, priceAndQuantityData, isVerifiedData } =
      await fetchProductsWithMetadata(data);

    return data.map((product, idx) => ({
      ...product,
      is_verified: isVerifiedData[idx]!,
      price_per_unit: toRupee(product.price_per_unit || 0),
      total_price: toRupee(product.total_price || 0),
      imageUrl: imageUrls[idx]!,
      priceAndQuantity: priceAndQuantityData[idx]!.map((tier) => ({
        ...tier,
        price: toRupee(tier.price),
      })),
    })) as EnrichedProduct[];
  } catch (error) {
    console.error("Error fetching latest products:", error);
    throw new Error("Failed to fetch latest products");
  }
};

export const getProductMainImageUrl = async (id: string): Promise<string> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", id)
      .order("display_order", { ascending: true })
      .limit(1)
      .single();

    if (error) throw error;
    return data.image_url;
  } catch (error) {
    console.error("Error fetching product image:", error);
    throw new Error("Failed to fetch product image");
  }
};

export const getPricesAndQuantities = async (id: string) => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("product_tier_pricing")
      .select("*")
      .eq("product_id", id)
      .eq("is_active", true)
      .order("quantity", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching prices and quantities:", error);
    throw new Error("Failed to fetch prices and quantities");
  }
};

// Optimized product creation with better error handling and transaction-like behavior
export const addProduct = async (
  supplierId: string,
  product: z.infer<typeof productFormSchema>
): Promise<{ id: string }> => {
  try {
    const supabase = await createClient();

    // Validate input
    const validation = productFormSchema.safeParse(product);
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.error.message}`);
    }

    // STEP 1: Insert the basic product
    const { data: productData, error: productError } = await supabase
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
        dropship_available: product.dropship_available ?? false,
        dropship_price: product.dropship_price
          ? toPaise(product.dropship_price)
          : null,
        white_label_shipping: product.white_label_shipping ?? false,
        dispatch_time: product.dispatch_time || null,
      })
      .select("id")
      .single();

    if (productError) throw productError;

    // STEP 2-6: Handle all related data in parallel for better performance
    await Promise.all([
      handleTags(supabase, productData.id, product.tags),
      handleImages(supabase, productData.id, product.images),
      handleTiers(supabase, productData.id, product.tiers),
      handleSpecs(supabase, productData.id, product.specifications),
    ]);

    revalidatePath("/supplier/profile");
    return productData;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error(
      `Failed to add product: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Helper functions for better organization and reusability
const handleTags = async (
  supabase: any,
  productId: string,
  tags?: string[]
) => {
  if (!tags?.length) return;

  try {
    // Get existing tags
    const { data: existingTags } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", tags);

    const existingTagMap = new Map(
      existingTags?.map((tag: any) => [tag.name, tag.id]) || []
    );

    // Create new tags
    const newTags = tags.filter((tagName) => !existingTagMap.has(tagName));
    if (newTags.length > 0) {
      const { data: createdTags, error: tagError } = await supabase
        .from("tags")
        .insert(newTags.map((name) => ({ name })))
        .select("id, name");

      if (tagError) throw tagError;
      createdTags?.forEach((tag: any) => existingTagMap.set(tag.name, tag.id));
    }

    // Link tags to product
    const productTags = tags
      .map((tagName) => {
        const tagId = existingTagMap.get(tagName);
        return tagId ? { product_id: productId, tag_id: tagId } : null;
      })
      .filter(Boolean);

    if (productTags.length > 0) {
      const { error: linkError } = await supabase
        .from("product_tags")
        .insert(productTags);
      if (linkError) throw linkError;
    }
  } catch (error) {
    console.error("Error handling tags:", error);
    throw error;
  }
};

const handleImages = async (
  supabase: any,
  productId: string,
  images?: any[]
) => {
  if (!images?.length) return;

  try {
    const imagePromises = images.map(async (file) => {
      // If there's a new image file, upload it
      if (file.image) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `product-image-${timestamp}-${randomString}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file.image);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        return {
          product_id: productId,
          image_url: publicUrl.publicUrl,
          display_order: file.display_order,
        };
      }

      // If there's an existing image URL, keep it
      if (file.existingUrl) {
        return {
          product_id: productId,
          image_url: file.existingUrl,
          display_order: file.display_order,
        };
      }

      // Skip if neither new image nor existing URL
      return null;
    });

    const imageResults = (await Promise.all(imagePromises)).filter(Boolean);
    if (imageResults.length > 0) {
      await supabase.from("product_images").insert(imageResults);
    }
  } catch (error) {
    console.error("Error handling images:", error);
    throw error;
  }
};

const handleTiers = async (supabase: any, productId: string, tiers?: any[]) => {
  if (!tiers?.length) return;

  try {
    const tierData = tiers
      .filter(
        (tier) => tier.qty && tier.price && tier.qty > 0 && tier.price > 0
      )
      .map((tier) => ({
        product_id: productId,
        quantity: tier.qty,
        price: toPaise(tier.price),
      }));

    if (tierData.length > 0) {
      await supabase.from("product_tier_pricing").insert(tierData);
    }
  } catch (error) {
    console.error("Error handling tiers:", error);
    throw error;
  }
};

const handleSpecs = async (
  supabase: any,
  productId: string,
  specifications?: any[]
) => {
  if (!specifications?.length) return;

  try {
    const specData = specifications
      .filter((spec) => spec.spec_name?.trim() && spec.spec_value?.trim())
      .map((spec) => ({
        product_id: productId,
        spec_name: spec.spec_name.trim(),
        spec_value: spec.spec_value.trim(),
        spec_unit: spec.spec_unit,
      }));

    if (specData.length > 0) {
      await supabase.from("product_specifications").insert(specData);
    }
  } catch (error) {
    console.error("Error handling specifications:", error);
    throw error;
  }
};

export const getTags = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("tags").select("*");

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
};

interface ProductParams {
  page: number;
  page_size: number;
  dropship_available?: boolean;
  sort_by?: string;
}

interface ProductsResponse {
  products: any[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getProducts = async (
  params: ProductParams
): Promise<ProductsResponse> => {
  try {
    const supabase = await createClient();
    const { page, page_size, dropship_available } = params;

    const from = (page - 1) * page_size;
    const to = from + page_size - 1;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (dropship_available) {
      query = query.eq("dropship_available", true);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    // Fetch all related data in parallel
    const [images, pricesAndQuantities, business] = await Promise.all([
      Promise.all(data.map((product) => getProductMainImageUrl(product.id))),
      Promise.all(data.map((product) => getPricesAndQuantities(product.id))),
      Promise.all(data.map((product) => getBusiness(product.supplier_id!))),
    ]);

    return {
      products: data.map((product, idx) => {
        if (business[idx].status === "APPROVED") {
          return {
            ...business[idx],
            ...product,
            imageUrl: images[idx],
            price_per_unit: toRupee(product.price_per_unit || 0),
            total_price: toRupee(product.total_price || 0),
            priceAndQuantity:
              pricesAndQuantities[idx]?.map((tier) => ({
                ...tier,
                price: toRupee(tier.price),
              })) || [],
          };
        }
      }),
      total: count ?? 0,
      page,
      page_size,
      total_pages: count ? Math.ceil(count / page_size) : 0,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
};

const getProductById = async (productId: string) => {
  try {
    const supabase = await createClient();

    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        is_sample_available,
        quantity,
        total_price,
        price_per_unit,
        supplier_id,
        length,
        breadth,
        height,
        weight,
        product_images (
          id,
          image_url,
          display_order
        ),
        product_tier_pricing (
          id,
          quantity,
          price
        ),
        product_specifications (
          id,
          spec_name,
          spec_unit,
          spec_value
        )
      `
      )
      .eq("id", productId)
      .order("display_order", {
        foreignTable: "product_images",
        ascending: true,
      })
      .eq("product_tier_pricing.is_active", true)
      .order("quantity", {
        foreignTable: "product_tier_pricing",
        ascending: true,
      })
      .single();

    if (productError) throw productError;

    return {
      ...product,
      total_price: toRupee(product.total_price || 0),
      product_tier_pricing:
        product.product_tier_pricing?.map((tier) => ({
          ...tier,
          price: toRupee(tier.price),
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw new Error("Failed to fetch product");
  }
};

// Cached version for better performance
export const getProductByIdCached = cache(getProductById);

// Get product data for editing (includes all related data)
export const getProductForEdit = async (productId: string) => {
  try {
    const supabase = await createClient();

    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        description,
        is_sample_available,
        quantity,
        total_price,
        price_per_unit,
        supplier_id,
        length,
        breadth,
        height,
        weight,
        category_id,
        subcategory_id,
        brand,
        country_of_origin,
        hsn_code,
        youtube_link,
        is_active,
        dropship_available,
        dropship_price,
        white_label_shipping,
        dispatch_time,
        is_bulk_pricing,
        product_images (
          id,
          image_url,
          display_order
        ),
        product_tier_pricing (
          id,
          quantity,
          price,
          is_active
        ),
        product_specifications (
          id,
          spec_name,
          spec_unit,
          spec_value
        )
      `
      )
      .eq("id", productId)
      .order("display_order", {
        foreignTable: "product_images",
        ascending: true,
      })
      .order("quantity", {
        foreignTable: "product_tier_pricing",
        ascending: true,
      })
      .single();

    if (productError) throw productError;

    // Get product tags
    const { data: productTags } = await supabase
      .from("product_tags")
      .select("tag_id")
      .eq("product_id", productId);

    const tagIds = productTags?.map((pt) => pt.tag_id) || [];

    const { data: tags } = await supabase
      .from("tags")
      .select("id, name")
      .in("id", tagIds);

    return {
      ...product,
      total_price: toRupee(product.total_price || 0),
      price_per_unit: toRupee(product.price_per_unit || 0),
      dropship_price: product.dropship_price
        ? toRupee(product.dropship_price)
        : undefined,
      product_tier_pricing:
        product.product_tier_pricing?.map((tier) => ({
          ...tier,
          price: toRupee(tier.price),
        })) || [],
      tags: tags?.map((tag) => tag.name) || [],
    };
  } catch (error) {
    console.error("Error fetching product for edit:", error);
    throw new Error("Failed to fetch product for editing");
  }
};

// Update existing product
export const updateProduct = async (
  productId: string,
  supplierId: string,
  product: z.infer<typeof productFormSchema>
): Promise<{ id: string }> => {
  try {
    const supabase = await createClient();

    // Validate input
    const validation = productFormSchema.safeParse(product);
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.error.message}`);
    }

    // STEP 1: Update the basic product
    const { data: productData, error: productError } = await supabase
      .from("products")
      .update({
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
        dropship_available: product.dropship_available ?? false,
        dropship_price: product.dropship_price
          ? toPaise(product.dropship_price)
          : null,
        white_label_shipping: product.white_label_shipping ?? false,
        dispatch_time: product.dispatch_time || null,
      })
      .eq("id", productId)
      .eq("supplier_id", supplierId)
      .select("id")
      .single();

    if (productError) throw productError;

    // STEP 2: Delete existing related data
    await Promise.all([
      supabase.from("product_tags").delete().eq("product_id", productId),
      supabase.from("product_images").delete().eq("product_id", productId),
      supabase
        .from("product_tier_pricing")
        .delete()
        .eq("product_id", productId),
      supabase
        .from("product_specifications")
        .delete()
        .eq("product_id", productId),
    ]);

    // STEP 3: Handle all related data in parallel for better performance
    await Promise.all([
      handleTags(supabase, productId, product.tags),
      handleImages(supabase, productId, product.images),
      handleTiers(supabase, productId, product.tiers),
      handleSpecs(supabase, productId, product.specifications),
    ]);

    revalidatePath("/supplier/manage-products");
    revalidatePath("/supplier/profile");
    return productData;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(
      `Failed to update product: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
