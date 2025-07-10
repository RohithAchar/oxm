// api/product-images/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const { product_id, image_url, display_order } = body;

    // Validate input
    if (!product_id || !image_url || display_order === undefined) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "product_id, image_url, and display_order are required",
          fields: {
            product_id: !product_id ? "Missing" : null,
            image_url: !image_url ? "Missing" : null,
            display_order: display_order === undefined ? "Missing" : null,
          },
        },
        { status: 400 }
      );
    }

    // Insert into DB
    const { data, error } = await supabase.from("product_images").insert([
      {
        product_id,
        image_url,
        display_order,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Insert failed", message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Image metadata saved",
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
