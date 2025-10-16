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
    const limit = Math.min(Number(searchParams.get("limit") || 8), 24);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: products, error } = await supabase
      .from("products")
      .select("id,name,description,is_sample_available,supplier_id")
      .order("created_at", { ascending: false })
      .range(from, to);

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
          description: product.description,
          isSampleAvailable: Boolean(product.is_sample_available),
          name: product.name || "",
          supplierName: business?.business_name || "",
          tierPricing: (tierPricing || []).map((t: any) => ({
            id: t.id,
            price: t.price,
            quantity: t.quantity,
          })),
          isSupplierVerified: Boolean(business?.is_verified),
          businessStatus: business?.status,
        } as const;
      })
    );

    const visible = enriched.filter((p) => p.businessStatus === "APPROVED");

    return NextResponse.json({ products: visible, page, limit });
  } catch (e: any) {
    console.error("home-products GET error", e);
    return NextResponse.json(
      { error: e?.message || "Internal error" },
      { status: 500 }
    );
  }
}
