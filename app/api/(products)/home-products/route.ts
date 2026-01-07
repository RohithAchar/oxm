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
    const pageSize = Math.min(Number(searchParams.get("page_size") || 12), 48);
    const limit = Math.min(Number(searchParams.get("limit") || pageSize), 48);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // First, get the total count to validate the range
    const { count: totalCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    // If the requested range is beyond available products, return empty
    if (from >= (totalCount || 0)) {
      return NextResponse.json({
        products: [],
        page,
        pageSize: limit,
        hasMore: false,
        total: totalCount || 0,
      });
    }

    // Adjust 'to' to not exceed total count
    const adjustedTo = Math.min(to, (totalCount || 0) - 1);

    const { data: products, error, count } = await supabase
      .from("products")
      .select("id,name,brand,description,is_sample_available,supplier_id,is_active,dropship_price,dropship_available", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, adjustedTo);

    // Handle range errors gracefully
    if (error) {
      // If it's a range error, return empty results
      if (error.code === "PGRST103") {
        return NextResponse.json({
          products: [],
          page,
          pageSize: limit,
          hasMore: false,
          total: totalCount || 0,
        });
      }
      throw error;
    }

    const enriched = await Promise.all(
      (products || []).map(async (product) => {
        const [imageUrl, tierPricing, business] = await Promise.all([
          getProductMainImageUrl(product.id).catch(() => null),
          getPricesAndQuantities(product.id).catch(() => []),
          product.supplier_id
            ? getBusiness(product.supplier_id).catch(() => null)
            : Promise.resolve(null),
        ]);

        return {
          id: product.id,
          imageUrl: imageUrl || null,
          name: product.name || "",
          brand: product.brand || "",
          supplierName: business?.business_name || "Supplier",
          priceAndQuantity: (tierPricing || []).map((t: any) => ({
            id: t.id,
            price: t.price,
            quantity: t.quantity,
          })),
          dropshipPrice: product.dropship_price
            ? product.dropship_price
            : undefined,
          is_verified: Boolean(business?.is_verified),
          hasSample: Boolean(product.is_sample_available),
          is_active: product.is_active,
          businessStatus: business?.status,
        } as const;
      })
    );

    const visible = enriched.filter((p) => p.businessStatus === "APPROVED");
    
    // Calculate hasMore based on whether we got a full page of results
    // If we got fewer products than requested, there are no more
    const hasMore = visible.length === limit && (count || 0) > from + visible.length;

    return NextResponse.json({
      products: visible,
      page,
      pageSize: limit,
      hasMore,
      total: count || 0,
    });
  } catch (e: any) {
    console.error("home-products GET error", e);
    return NextResponse.json(
      { error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}
