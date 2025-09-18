import { createClient, createAnonClient } from "@/utils/supabase/server";
import Fuse from "fuse.js";

// Constants
const PRICE_MULTIPLIER = 100;

// Utility functions
const toPaise = (price: number) => Math.round(price * PRICE_MULTIPLIER);
const toRupee = (price: number) => (price / PRICE_MULTIPLIER).toFixed(2);

// Basic edit distance (Levenshtein) for fuzzy matching
const computeEditDistance = (a: string, b: string): number => {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  const m = s.length;
  const n = t.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = Array(n + 1)
    .fill(0)
    .map((_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return dp[n];
};

const tokenMatchesFuzzy = (query: string, text: string): boolean => {
  if (!query || !text) return false;
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  // If short query, allow small edit distance across text tokens
  const tokens = t.split(/[^a-z0-9]+/i).filter(Boolean);
  for (const tok of tokens) {
    const dist = computeEditDistance(q, tok);
    if (q.length <= 5 && dist <= 1) return true;
    if (q.length > 5 && dist <= 2) return true;
  }
  return false;
};

// Enhanced filter interface
export interface EnhancedProductFilters {
  q?: string;
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  state?: string;
  sampleAvailable?: boolean;
  dropshipAvailable?: boolean;
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

// Enhanced product response interface
export interface EnhancedProductsResponse {
  products: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  filters: {
    availableCategories: Array<{ id: string; name: string; count: number }>;
    availableSubcategories: Array<{
      id: string;
      name: string;
      parent_id: string;
      count: number;
    }>;
    availableCities: Array<{ name: string; count: number }>;
    availableStates: Array<{ name: string; count: number }>;
    availableTags: Array<{ name: string; count: number }>;
    availableColors: Array<{ name: string; count: number }>;
    availableSizes: Array<{ name: string; count: number }>;
    priceRange: { min: number; max: number };
  };
}

// Helper function to get product main image URL
const getProductMainImageUrl = async (productId: string): Promise<string> => {
  try {
    const supabase = await createAnonClient();
    const { data, error } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", productId)
      .order("display_order", { ascending: true })
      .limit(1)
      .single();

    if (error || !data) {
      return "/product-placeholder.png";
    }

    return data.image_url;
  } catch (error) {
    console.error("Error fetching product image:", error);
    return "/product-placeholder.png";
  }
};

// Helper function to get product pricing tiers
const getPricesAndQuantities = async (productId: string) => {
  try {
    const supabase = await createAnonClient();
    const { data, error } = await supabase
      .from("product_tier_pricing")
      .select("id, price, quantity")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("quantity", { ascending: true });

    if (error) {
      console.error("Error fetching pricing tiers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching pricing tiers:", error);
    return [];
  }
};

// Helper function to get business information
const getBusiness = async (supplierId: string) => {
  try {
    const supabase = await createAnonClient();
    const { data, error } = await supabase
      .from("supplier_businesses")
      .select("*")
      .eq("profile_id", supplierId)
      .single();

    if (error) {
      console.error("Error fetching business:", error);
      return {
        business_name: "Unknown Supplier",
        city: "",
        state: "",
        is_verified: false,
        status: "PENDING",
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching business:", error);
    return {
      business_name: "Unknown Supplier",
      city: "",
      state: "",
      is_verified: false,
      status: "PENDING",
    };
  }
};

// Helper function to get product tags
const getProductTags = async (productId: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_tags")
      .select("tags(name)")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching product tags:", error);
      return [];
    }

    return data?.map((item) => item.tags?.name).filter(Boolean) || [];
  } catch (error) {
    console.error("Error fetching product tags:", error);
    return [];
  }
};

// Helper function to get product colors
const getProductColors = async (productId: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_colors")
      .select("supplier_colors(name)")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching product colors:", error);
      return [];
    }

    return (
      data?.map((item) => item.supplier_colors?.name).filter(Boolean) || []
    );
  } catch (error) {
    console.error("Error fetching product colors:", error);
    return [];
  }
};

// Helper function to get product sizes
const getProductSizes = async (productId: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_sizes")
      .select("supplier_sizes(name)")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching product sizes:", error);
      return [];
    }

    return data?.map((item) => item.supplier_sizes?.name).filter(Boolean) || [];
  } catch (error) {
    console.error("Error fetching product sizes:", error);
    return [];
  }
};

// Helper function to get product specifications
const getProductSpecifications = async (
  productId: string
): Promise<Array<{ spec_name: string; spec_value: string }>> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("product_specifications")
      .select("spec_name, spec_value")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching product specifications:", error);
      return [];
    }

    return (data || []).map((row) => ({
      spec_name: row.spec_name,
      spec_value: row.spec_value,
    }));
  } catch (error) {
    console.error("Error fetching product specifications:", error);
    return [];
  }
};

// Simple products function (fallback for when no filters are applied)
const getSimpleProducts = async (
  filters: EnhancedProductFilters
): Promise<EnhancedProductsResponse> => {
  try {
    const supabase = await createAnonClient();
    const { page = 1, pageSize = 12 } = filters;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const {
      data: products,
      count,
      error,
    } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching simple products:", error);
      throw error;
    }

    // Fetch additional data for each product
    const enrichedProducts = await Promise.all(
      products?.map(async (product) => {
        const [imageUrl, priceAndQuantity, business] = await Promise.all([
          getProductMainImageUrl(product.id),
          getPricesAndQuantities(product.id),
          getBusiness(product.supplier_id!),
        ]);

        // Return undefined for non-approved businesses (same as original function)
        if (business.status !== "APPROVED") return undefined;

        return {
          ...product,
          imageUrl,
          price_per_unit: toRupee(product.price_per_unit || 0),
          total_price: toRupee(product.total_price || 0),
          priceAndQuantity: priceAndQuantity.map((tier) => ({
            ...tier,
            price: toRupee(tier.price),
          })),
          tags: [],
          colors: [],
          sizes: [],
          supplierName: business.business_name || "Unknown Supplier",
          city: business.city || "",
          state: business.state || "",
          is_verified: business.is_verified || false,
          business_status: business.status,
        };
      }) || []
    );

    return {
      products: enrichedProducts,
      total: count || 0,
      page,
      pageSize,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
      filters: {
        availableCategories: [],
        availableSubcategories: [],
        availableCities: [],
        availableStates: [],
        availableTags: [],
        availableColors: [],
        availableSizes: [],
        priceRange: { min: 0, max: 100000 },
      },
    };
  } catch (error) {
    console.error("Error in getSimpleProducts:", error);
    throw new Error("Failed to fetch products");
  }
};

// Main function to get enhanced products with filters
export const getEnhancedProducts = async (
  filters: EnhancedProductFilters = {}
): Promise<EnhancedProductsResponse> => {
  try {
    // If no filters are applied, use the original simple approach for better performance
    const hasFilters = Object.values(filters).some((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value === true;
      return value !== undefined && value !== "" && value !== "created_at_desc";
    });

    if (!hasFilters) {
      const simpleResult = await getSimpleProducts(filters);

      return simpleResult;
    }

    const supabase = await createClient();
    const {
      q,
      category,
      subcategory,
      priceMin,
      priceMax,
      city,
      state,
      sampleAvailable,
      dropshipAvailable,
      tags,
      colors,
      sizes,
      sortBy = "created_at_desc",
      page = 1,
      pageSize = 12,
    } = filters;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Build the main query - simplified to avoid complex joins
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .range(from, to);

    // Apply keyword search (name, brand, description, hsn_code) and also match category/subcategory names
    if (q && q.trim() !== "") {
      const like = `%${q.trim()}%`;

      // Find category and subcategory ids whose names match q
      const [catRes, subcatRes] = await Promise.all([
        supabase
          .from("categories")
          .select("id")
          .is("parent_id", null)
          .ilike("name", like),
        supabase
          .from("categories")
          .select("id")
          .not("parent_id", "is", null)
          .ilike("name", like),
      ]);

      const matchedCategoryIds = (catRes.data || []).map(
        (r: { id: string }) => r.id
      );
      const matchedSubcategoryIds = (subcatRes.data || []).map(
        (r: { id: string }) => r.id
      );

      const orParts: string[] = [
        `name.ilike.${like}`,
        `brand.ilike.${like}`,
        `description.ilike.${like}`,
        `hsn_code.ilike.${like}`,
      ];

      if (matchedCategoryIds.length > 0) {
        const list = matchedCategoryIds.join(",");
        orParts.push(`category_id.in.(${list})`);
      }
      if (matchedSubcategoryIds.length > 0) {
        const list = matchedSubcategoryIds.join(",");
        orParts.push(`subcategory_id.in.(${list})`);
      }

      query = query.or(orParts.join(","));
    }

    // Apply category filters
    if (category) {
      query = query.eq("category_id", category);
    }
    if (subcategory) {
      query = query.eq("subcategory_id", subcategory);
    }

    // Apply price filters (convert to paise)
    if (priceMin !== undefined) {
      query = query.gte("price_per_unit", toPaise(priceMin));
    }
    if (priceMax !== undefined) {
      query = query.lte("price_per_unit", toPaise(priceMax));
    }

    // Apply boolean filters on products table
    if (sampleAvailable !== undefined) {
      query = query.eq("is_sample_available", sampleAvailable);
    }
    if (dropshipAvailable !== undefined) {
      query = query.eq("dropship_available", dropshipAvailable);
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        query = query.order("price_per_unit", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price_per_unit", { ascending: false });
        break;
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      case "name_desc":
        query = query.order("name", { ascending: false });
        break;
      case "created_at_asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "created_at_desc":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    let { data: products, count, error } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    // Fetch additional data for each product
    const enrichedProducts = await Promise.all(
      products?.map(async (product) => {
        const [
          imageUrl,
          priceAndQuantity,
          productTags,
          productColors,
          productSizes,
          business,
          specifications,
        ] = await Promise.all([
          getProductMainImageUrl(product.id),
          getPricesAndQuantities(product.id),
          getProductTags(product.id),
          getProductColors(product.id),
          getProductSizes(product.id),
          getBusiness(product.supplier_id!),
          getProductSpecifications(product.id),
        ]);

        // Return undefined for non-approved businesses (same as original function)
        if (business.status !== "APPROVED") return undefined;

        return {
          ...product,
          imageUrl,
          price_per_unit: toRupee(product.price_per_unit || 0),
          total_price: toRupee(product.total_price || 0),
          priceAndQuantity: priceAndQuantity.map((tier) => ({
            ...tier,
            price: toRupee(tier.price),
          })),
          tags: productTags,
          colors: productColors,
          sizes: productSizes,
          supplierName: business.business_name || "Unknown Supplier",
          city: business.city || "",
          state: business.state || "",
          is_verified: business.is_verified || false,
          business_status: business.status,
          specifications,
        };
      }) || []
    );

    // Start with all products (including undefined ones, like the original function)
    let filteredProducts = enrichedProducts;

    // Show the actual product data for debugging
    const validProducts = enrichedProducts.filter((p) => p !== undefined);

    // Apply location filters (only on defined products)
    if (city) {
      const beforeCount = filteredProducts.filter(
        (p) => p !== undefined
      ).length;
      filteredProducts = filteredProducts.filter(
        (product) => product && product.city === city
      );
      const afterCount = filteredProducts.filter((p) => p !== undefined).length;
    }
    if (state) {
      const beforeCount = filteredProducts.filter(
        (p) => p !== undefined
      ).length;
      filteredProducts = filteredProducts.filter(
        (product) => product && product.state === state
      );
      const afterCount = filteredProducts.filter((p) => p !== undefined).length;
    }

    // Apply tag, color, and size filters after enrichment (only on defined products)
    if (tags && tags.length > 0) {
      const beforeCount = filteredProducts.filter(
        (p) => p !== undefined
      ).length;
      filteredProducts = filteredProducts.filter(
        (product) => product && tags.some((tag) => product.tags.includes(tag))
      );
      const afterCount = filteredProducts.filter((p) => p !== undefined).length;
    }

    if (colors && colors.length > 0) {
      const requested = colors.map((c) =>
        (c || "").toString().trim().toLowerCase()
      );
      filteredProducts = filteredProducts.filter((product) => {
        if (!product) return false;
        const productColors = (product.colors || []).map((c: string) =>
          (c || "").toString().trim().toLowerCase()
        );
        return requested.some((c) => productColors.includes(c));
      });
    }

    if (sizes && sizes.length > 0) {
      const requested = sizes.map((s) =>
        (s || "").toString().trim().toLowerCase()
      );
      filteredProducts = filteredProducts.filter((product) => {
        if (!product) return false;
        const productSizes = (product.sizes || []).map((s: string) =>
          (s || "").toString().trim().toLowerCase()
        );
        return requested.some((s) => productSizes.includes(s));
      });
    }

    // If no rows matched DB keyword search, widen result set and use fuzzy scoring on the client side
    if ((products?.length || 0) === 0 && q && q.trim() !== "") {
      const {
        data: fallbackProducts,
        count: fallbackCount,
        error: fbError,
      } = await supabase
        .from("products")
        .select("*", { count: "exact" })
        .eq("is_active", true)
        .range(from, to)
        .order("created_at", { ascending: false });
      if (!fbError && fallbackProducts) {
        products = fallbackProducts;
        count = fallbackCount || count;
        const fbEnriched = await Promise.all(
          fallbackProducts.map(async (product) => {
            const [
              imageUrl,
              priceAndQuantity,
              productTags,
              productColors,
              productSizes,
              business,
              specifications,
            ] = await Promise.all([
              getProductMainImageUrl(product.id),
              getPricesAndQuantities(product.id),
              getProductTags(product.id),
              getProductColors(product.id),
              getProductSizes(product.id),
              getBusiness(product.supplier_id!),
              getProductSpecifications(product.id),
            ]);
            if (business.status !== "APPROVED") return undefined;
            return {
              ...product,
              imageUrl,
              price_per_unit: toRupee(product.price_per_unit || 0),
              total_price: toRupee(product.total_price || 0),
              priceAndQuantity: priceAndQuantity.map((tier) => ({
                ...tier,
                price: toRupee(tier.price),
              })),
              tags: productTags,
              colors: productColors,
              sizes: productSizes,
              supplierName: business.business_name || "Unknown Supplier",
              city: business.city || "",
              state: business.state || "",
              is_verified: business.is_verified || false,
              business_status: business.status,
              specifications,
            };
          })
        );
        filteredProducts = fbEnriched;
      }
    }

    // Rank with Fuse.js when q is present (typo tolerant)
    if (q && q.trim() !== "") {
      const fuse = new Fuse(
        (filteredProducts || []).filter(Boolean).map((p: any) => ({
          ...p,
          // Compute category/subcategory names lazily as plain strings for Fuse by
          // piggybacking on the names present in filter options (best-effort):
          category_name: p.category_name || "",
          subcategory_name: p.subcategory_name || "",
        })) as any[],
        {
          includeScore: true,
          threshold: 0.38,
          ignoreLocation: true,
          useExtendedSearch: false,
          keys: [
            { name: "name", weight: 0.45 },
            { name: "brand", weight: 0.18 },
            { name: "description", weight: 0.15 },
            { name: "hsn_code", weight: 0.08 },
            { name: "category_name", weight: 0.09 },
            { name: "subcategory_name", weight: 0.08 },
            { name: "supplierName", weight: 0.06 },
            { name: "tags", weight: 0.03 },
            { name: "colors", weight: 0.025 },
            { name: "sizes", weight: 0.025 },
            { name: "specifications.spec_name", weight: 0.02 },
            { name: "specifications.spec_value", weight: 0.02 },
          ],
        }
      );
      filteredProducts = fuse.search(q.trim()).map((r) => r.item);
    }

    // Get filter options for the UI
    const filterOptions = await getFilterOptions(supabase, filters);

    return {
      products: filteredProducts,
      total: count || 0,
      page,
      pageSize,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
      filters: filterOptions,
    };
  } catch (error) {
    console.error("Error in getEnhancedProducts:", error);
    throw new Error("Failed to fetch products");
  }
};

// Helper function to get available filter options
const getFilterOptions = async (
  supabase: any,
  currentFilters: EnhancedProductFilters
) => {
  try {
    // Get all available categories
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name")
      .is("parent_id", null);

    // Get all available subcategories
    const { data: subcategories } = await supabase
      .from("categories")
      .select("id, name, parent_id")
      .not("parent_id", "is", null);

    // Get all available cities
    const { data: cities } = await supabase
      .from("supplier_businesses")
      .select("city")
      .eq("status", "APPROVED")
      .not("city", "is", null);

    // Get all available states
    const { data: states } = await supabase
      .from("supplier_businesses")
      .select("state")
      .eq("status", "APPROVED")
      .not("state", "is", null);

    // Get all available tags
    const { data: tags } = await supabase.from("tags").select("name");

    // Get all available colors
    const { data: colors } = await supabase
      .from("supplier_colors")
      .select("name");

    // Get all available sizes
    const { data: sizes } = await supabase
      .from("supplier_sizes")
      .select("name");

    // Get price range
    const { data: priceRange } = await supabase
      .from("products")
      .select("price_per_unit")
      .eq("is_active", true)
      .not("price_per_unit", "is", null);

    const prices =
      (priceRange
        ?.map((p: { price_per_unit: number | null }) => p.price_per_unit)
        .filter(Boolean) as number[]) || [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 100000;

    return {
      availableCategories:
        categories?.map((cat: { id: string; name: string }) => ({
          ...cat,
          count: 0,
        })) || [],
      availableSubcategories:
        subcategories?.map(
          (sub: { id: string; name: string; parent_id: string }) => ({
            ...sub,
            count: 0,
          })
        ) || [],
      availableCities:
        cities?.map((c: { city: string | null }) => ({
          name: c.city,
          count: 0,
        })) || [],
      availableStates:
        states?.map((s: { state: string | null }) => ({
          name: s.state,
          count: 0,
        })) || [],
      availableTags:
        tags?.map((t: { name: string }) => ({ name: t.name, count: 0 })) || [],
      availableColors:
        colors?.map((c: { name: string }) => ({ name: c.name, count: 0 })) ||
        [],
      availableSizes:
        sizes?.map((s: { name: string }) => ({ name: s.name, count: 0 })) || [],
      priceRange: {
        min: parseFloat(toRupee(minPrice)),
        max: parseFloat(toRupee(maxPrice)),
      },
    };
  } catch (error) {
    console.error("Error getting filter options:", error);
    return {
      availableCategories: [],
      availableSubcategories: [],
      availableCities: [],
      availableStates: [],
      availableTags: [],
      availableColors: [],
      availableSizes: [],
      priceRange: { min: 0, max: 100000 },
    };
  }
};

// Function to get a single product with all details
export const getEnhancedProductById = async (productId: string) => {
  try {
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories!products_category_id_fkey(name, slug),
        categories!products_subcategory_id_fkey(name, slug),
        supplier_businesses!products_supplier_id_fkey(
          business_name,
          city,
          state,
          is_verified,
          status
        )
      `
      )
      .eq("id", productId)
      .single();

    if (error || !product) {
      throw new Error("Product not found");
    }

    // Fetch additional data
    const [
      imageUrl,
      priceAndQuantity,
      productTags,
      productColors,
      productSizes,
    ] = await Promise.all([
      getProductMainImageUrl(product.id),
      getPricesAndQuantities(product.id),
      getProductTags(product.id),
      getProductColors(product.id),
      getProductSizes(product.id),
    ]);

    const supplier = ((product as any).supplier_businesses ?? null) as {
      business_name?: string;
      city?: string;
      state?: string;
      is_verified?: boolean;
    } | null;

    return {
      ...product,
      imageUrl,
      price_per_unit: toRupee(product.price_per_unit || 0),
      total_price: toRupee(product.total_price || 0),
      priceAndQuantity: priceAndQuantity.map((tier) => ({
        ...tier,
        price: toRupee(tier.price),
      })),
      tags: productTags,
      colors: productColors,
      sizes: productSizes,
      supplierName: supplier?.business_name || "Unknown Supplier",
      city: supplier?.city || "",
      state: supplier?.state || "",
      is_verified: supplier?.is_verified || false,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
};
