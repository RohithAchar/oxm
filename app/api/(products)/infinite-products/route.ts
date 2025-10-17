import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/utils/supabase/server";
import {
  getProductMainImageUrl,
  getPricesAndQuantities,
} from "@/lib/controller/product/productOperations";
import { getBusiness } from "@/lib/controller/business/businessOperations";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createAnonClient();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const pageSize = Math.min(Number(searchParams.get("page_size") || 24), 48);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Basic filters mirrored from enhanced filters subset
    const category = searchParams.get("category") || undefined;
    const subcategory = searchParams.get("subcategory") || undefined;
    const q = searchParams.get("q") || undefined;
    const sampleAvailable =
      searchParams.get("sample_available") === "true" ? true : undefined;
    const dropshipAvailable =
      searchParams.get("dropship_available") === "true" ? true : undefined;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (category) query = query.eq("category_id", category);
    if (subcategory) query = query.eq("subcategory_id", subcategory);
    if (sampleAvailable) query = query.eq("is_sample_available", true);
    if (dropshipAvailable) query = query.eq("is_dropship_available", true);
    if (q) {
      query = query.or(
        `name.ilike.%${q}%,description.ilike.%${q}%,brand.ilike.%${q}%`
      );
    }

    const { data: products, error, count } = await query;
    if (error) throw error;

    const enriched = await Promise.all(
      (products || []).map(async (product) => {
        const [imageUrl, tierPricing, business] = await Promise.all([
          getProductMainImageUrl(product.id),
          getPricesAndQuantities(product.id),
          product.supplier_id
            ? getBusiness(product.supplier_id)
            : Promise.resolve(undefined as any),
        ]);

        return {
          id: product.id,
          imageUrl: imageUrl || null,
          name: product.name || "",
          brand: product.brand || "",
          supplierName: business?.business_name || "",
          priceAndQuantity: (tierPricing || []).map((t: any) => ({
            id: t.id,
            price: t.price,
            quantity: t.quantity,
          })),
          is_verified: Boolean(business?.is_verified),
          is_sample_available: Boolean(product.is_sample_available),
          is_active: Boolean(product.is_active),
          businessStatus: business?.status,
        } as const;
      })
    );

    const visible = enriched.filter((p) => p.businessStatus === "APPROVED");
    const hasMore = from + visible.length < (count || 0);

    return NextResponse.json({
      products: visible,
      page,
      pageSize,
      hasMore,
      total: count || 0,
    });
  } catch (e: any) {
    console.error("infinite-products GET error", e);
    return NextResponse.json(
      { error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}
