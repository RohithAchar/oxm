import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/businesses/:id/verification
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: businessId } = await params;

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, message, is_verified } = body;

    if (!status || typeof is_verified !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("supplier_businesses")
      .update({
        status,
        is_verified,
        message,
      })
      .eq("id", businessId)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { error: "Failed to update verification status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Verification status updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON",
          message: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

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
