import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Verify user owns this product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, supplier_id")
      .eq("id", productId)
      .eq("supplier_id", user.id)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found or access denied" },
        { status: 404 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `products/${productId}/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    // Save image record to database
    const { data: imageData, error: imageError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_url: urlData.publicUrl,
        file_path: filePath,
        display_order: 0, // Will be updated based on existing images
      })
      .select()
      .single();

    if (imageError) {
      console.error("Database error:", imageError);
      // Clean up uploaded file
      await supabase.storage.from("product-images").remove([filePath]);
      return NextResponse.json(
        { error: "Failed to save image record" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        id: imageData.id,
        image_url: urlData.publicUrl,
        file_path: filePath,
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
