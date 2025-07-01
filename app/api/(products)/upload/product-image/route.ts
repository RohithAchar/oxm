import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;
    const displayOrder = formData.get("displayOrder") as string;

    // Basic validation
    if (!file || !productId || !displayOrder) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "file, productId, and displayOrder are required",
        },
        { status: 400 }
      );
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("product-images") // Bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload failed", message: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON",
          message: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

    // Handle specific error types
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: error.message,
          details: error.details,
        },
        { status: 400 }
      );
    }

    if (error.name === "UnauthorizedError") {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Invalid credentials",
        },
        { status: 401 }
      );
    }

    // Database connection errors
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          error: "Service unavailable",
          message: "Database connection failed",
        },
        { status: 503 }
      );
    }

    // Generic server error
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
