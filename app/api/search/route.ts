import { createAnonClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  description: string;
  hsn_code: string;
  category_name: string;
  subcategory_name: string;
  supplierName: string;
  imageUrl: string;
  price_per_unit: number;
  is_verified: boolean;
  is_sample_available: boolean;
  is_dropship_available: boolean;
  tags: string[];
  colors: string[];
  sizes: string[];
  relevance_score?: number;
  highlighted_name?: string;
  highlighted_description?: string;
}

interface SearchSuggestions {
  products: Array<{
    id: string;
    name: string;
    brand: string;
    category_name: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
  }>;
  brands: Array<{
    name: string;
    count: number;
  }>;
  popular_searches: string[];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const type = searchParams.get("type") || "products"; // products, suggestions, autocomplete
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "20", 10) || 20,
      100
    );
    const page = Math.max(
      parseInt(searchParams.get("page") || "1", 10) || 1,
      1
    );
    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";
    const priceMin = searchParams.get("price_min")
      ? parseFloat(searchParams.get("price_min")!)
      : undefined;
    const priceMax = searchParams.get("price_max")
      ? parseFloat(searchParams.get("price_max")!)
      : undefined;
    const city = searchParams.get("city") || "";
    const state = searchParams.get("state") || "";
    const sampleAvailable = searchParams.get("sample_available") === "true";
    const dropshipAvailable = searchParams.get("dropship_available") === "true";
    const tags = searchParams.get("tags")
      ? searchParams.get("tags")!.split(",").filter(Boolean)
      : [];
    const colors = searchParams.get("colors")
      ? searchParams.get("colors")!.split(",").filter(Boolean)
      : [];
    const sizes = searchParams.get("sizes")
      ? searchParams.get("sizes")!.split(",").filter(Boolean)
      : [];
    const sortBy = searchParams.get("sort") || "relevance";

    const supabase = await createAnonClient();

    if (type === "suggestions") {
      return await getSearchSuggestions(supabase, query, limit);
    }

    if (type === "autocomplete") {
      return await getAutocompleteSuggestions(supabase, query, limit);
    }

    // Main product search
    return await searchProducts(supabase, {
      query,
      limit,
      page,
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
      sortBy,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Search failed", message: "An error occurred while searching" },
      { status: 500 }
    );
  }
}

async function searchProducts(supabase: any, params: any) {
  const {
    query,
    limit,
    page,
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
    sortBy,
  } = params;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build the main query
  let dbQuery = supabase
    .from("products")
    .select(
      `
      id,
      name,
      brand,
      description,
      hsn_code,
      price_per_unit,
      is_sample_available,
      is_dropship_available,
      tags,
      colors,
      sizes,
      image_url,
      category_id,
      subcategory_id,
      supplier_id,
      supplier_businesses!inner(
        business_name,
        is_verified,
        city,
        state
      ),
      categories!inner(
        name
      ),
      subcategories:categories!inner(
        name
      )
    `
    )
    .eq("is_active", true)
    .range(from, to);

  // Apply filters
  if (category) {
    dbQuery = dbQuery.eq("category_id", category);
  }
  if (subcategory) {
    dbQuery = dbQuery.eq("subcategory_id", subcategory);
  }
  if (priceMin !== undefined) {
    dbQuery = dbQuery.gte("price_per_unit", priceMin * 100); // Convert to paise
  }
  if (priceMax !== undefined) {
    dbQuery = dbQuery.lte("price_per_unit", priceMax * 100);
  }
  if (city) {
    dbQuery = dbQuery.eq("supplier_businesses.city", city);
  }
  if (state) {
    dbQuery = dbQuery.eq("supplier_businesses.state", state);
  }
  if (sampleAvailable) {
    dbQuery = dbQuery.eq("is_sample_available", true);
  }
  if (dropshipAvailable) {
    dbQuery = dbQuery.eq("is_dropship_available", true);
  }

  // Apply sorting
  switch (sortBy) {
    case "price_asc":
      dbQuery = dbQuery.order("price_per_unit", { ascending: true });
      break;
    case "price_desc":
      dbQuery = dbQuery.order("price_per_unit", { ascending: false });
      break;
    case "name_asc":
      dbQuery = dbQuery.order("name", { ascending: true });
      break;
    case "name_desc":
      dbQuery = dbQuery.order("name", { ascending: false });
      break;
    case "created_at_asc":
      dbQuery = dbQuery.order("created_at", { ascending: true });
      break;
    case "created_at_desc":
      dbQuery = dbQuery.order("created_at", { ascending: false });
      break;
    default:
      // For relevance sorting, we'll handle it after getting results
      dbQuery = dbQuery.order("created_at", { ascending: false });
  }

  const { data: products, error, count } = await dbQuery;

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Transform and enhance results
  let enhancedProducts: SearchResult[] = (products || []).map(
    (product: any) => ({
      id: product.id,
      name: product.name,
      brand: product.brand || "",
      description: product.description || "",
      hsn_code: product.hsn_code || "",
      category_name: product.categories?.name || "",
      subcategory_name: product.subcategories?.name || "",
      supplierName: product.supplier_businesses?.business_name || "",
      imageUrl: product.image_url || "/product-placeholder.png",
      price_per_unit: product.price_per_unit || 0,
      is_verified: product.supplier_businesses?.is_verified || false,
      is_sample_available: product.is_sample_available || false,
      is_dropship_available: product.is_dropship_available || false,
      tags: product.tags || [],
      colors: product.colors || [],
      sizes: product.sizes || [],
    })
  );

  // Apply text search and relevance scoring if query exists
  if (query && query.trim() !== "") {
    enhancedProducts = await applyTextSearch(enhancedProducts, query);
  }

  // Apply tag, color, and size filters
  if (tags.length > 0) {
    enhancedProducts = enhancedProducts.filter((product) =>
      tags.some((tag: string) => product.tags.includes(tag))
    );
  }
  if (colors.length > 0) {
    enhancedProducts = enhancedProducts.filter((product) =>
      colors.some((color: string) => product.colors.includes(color))
    );
  }
  if (sizes.length > 0) {
    enhancedProducts = enhancedProducts.filter((product) =>
      sizes.some((size: string) => product.sizes.includes(size))
    );
  }

  // Apply highlighting
  if (query && query.trim() !== "") {
    enhancedProducts = enhancedProducts.map((product) => ({
      ...product,
      highlighted_name: highlightText(product.name, query),
      highlighted_description: highlightText(product.description, query),
    }));
  }

  return NextResponse.json({
    success: true,
    data: enhancedProducts,
    total: count || enhancedProducts.length,
    page,
    limit,
    totalPages: Math.ceil((count || enhancedProducts.length) / limit),
    query,
  });
}

async function applyTextSearch(products: SearchResult[], query: string) {
  const fuse = new Fuse(products, {
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
    useExtendedSearch: false,
    keys: [
      { name: "name", weight: 0.4 },
      { name: "brand", weight: 0.2 },
      { name: "description", weight: 0.15 },
      { name: "hsn_code", weight: 0.1 },
      { name: "category_name", weight: 0.08 },
      { name: "subcategory_name", weight: 0.05 },
      { name: "supplierName", weight: 0.02 },
    ],
  });

  const searchResults = fuse.search(query);
  return searchResults.map((result) => ({
    ...result.item,
    relevance_score: result.score ? 1 - result.score : 1,
  }));
}

function highlightText(text: string, query: string): string {
  if (!text || !query) return text;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>'
  );
}

async function getSearchSuggestions(
  supabase: any,
  query: string,
  limit: number
) {
  if (!query || query.length < 2) {
    return NextResponse.json({
      success: true,
      data: {
        products: [],
        categories: [],
        brands: [],
        popular_searches: [],
      },
    });
  }

  const like = `%${query}%`;

  // Get product suggestions
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      brand,
      categories!products_category_id_fkey(name)
    `
    )
    .eq("is_active", true)
    .or(`name.ilike.${like},brand.ilike.${like}`)
    .limit(limit);

  // Get category suggestions
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .ilike("name", like)
    .limit(5);

  // Get brand suggestions
  const { data: brands } = await supabase
    .from("products")
    .select("brand")
    .eq("is_active", true)
    .not("brand", "is", null)
    .ilike("brand", like)
    .limit(5);

  const suggestions: SearchSuggestions = {
    products: (products || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand || "",
      category_name: p.categories?.name || "",
    })),
    categories: categories || [],
    brands: (brands || []).map((b: any) => ({
      name: b.brand,
      count: 1, // We could calculate actual counts if needed
    })),
    popular_searches: [], // We'll implement this later with analytics
  };

  return NextResponse.json({
    success: true,
    data: suggestions,
  });
}

async function getAutocompleteSuggestions(
  supabase: any,
  query: string,
  limit: number
) {
  if (!query || query.length < 1) {
    return NextResponse.json({
      success: true,
      data: [],
    });
  }

  const like = `%${query}%`;

  const { data: suggestions, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      brand,
      categories!products_category_id_fkey(name)
    `
    )
    .eq("is_active", true)
    .or(`name.ilike.${like},brand.ilike.${like}`)
    .limit(limit);

  if (error) {
    console.error("Search API error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }

  const autocompleteResults = (suggestions || []).map((item: any) => ({
    id: item.id,
    text: item.name,
    type: "product",
    category: item.categories?.name || "",
    brand: item.brand || "",
  }));

  return NextResponse.json({
    success: true,
    data: autocompleteResults,
  });
}
