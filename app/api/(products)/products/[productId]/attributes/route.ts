import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Sets the colors and sizes associations for a product owned by the current supplier
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await params;
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const body = await req.json();
  const colorIds: string[] = Array.isArray(body?.colorIds) ? body.colorIds : [];
  const sizeIds: string[] = Array.isArray(body?.sizeIds) ? body.sizeIds : [];

  // Verify product ownership
  const { data: product, error: prodErr } = await supabase
    .from("products")
    .select("id, supplier_id")
    .eq("id", productId)
    .single();

  if (prodErr || !product || product.supplier_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Reset and insert associations
  const trx = supabase;

  const { error: delColorsErr } = await trx
    .from("product_colors")
    .delete()
    .eq("product_id", productId);
  if (delColorsErr) {
    return NextResponse.json({ error: delColorsErr.message }, { status: 400 });
  }

  const { error: delSizesErr } = await trx
    .from("product_sizes")
    .delete()
    .eq("product_id", productId);
  if (delSizesErr) {
    return NextResponse.json({ error: delSizesErr.message }, { status: 400 });
  }

  if (colorIds.length > 0) {
    const rows = colorIds.map((colorId) => ({
      product_id: productId,
      color_id: colorId,
    }));
    const { error } = await trx.from("product_colors").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  if (sizeIds.length > 0) {
    const rows = sizeIds.map((sizeId) => ({
      product_id: productId,
      size_id: sizeId,
    }));
    const { error } = await trx.from("product_sizes").insert(rows);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true });
}
