import { NextRequest, NextResponse } from "next/server";

import { formSchema } from "@/types/business";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    // Parse request body
    const body: z.infer<typeof formSchema> = await req.json();

    const {
      business_name,
      gst_number,
      business_address,
      city,
      state,
      pincode,
      gst_certificate_url,
      profile_avatar_url,
    } = body;

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to perform this action",
        },
        { status: 401 }
      );
    }
    if (!user.data.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You are not authorized to perform this action",
        },
        { status: 401 }
      );
    }

    if (
      !business_name ||
      !gst_number ||
      !business_address ||
      !city ||
      !state ||
      !pincode
    ) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Email and password are required",
          fields: {
            business_name: !business_name ? "Business name is required" : null,
            gst_number: !gst_number ? "GST number is required" : null,
            business_address: !business_address
              ? "Business address is required"
              : null,
            city: !city ? "City is required" : null,
            state: !state ? "State is required" : null,
            pincode: !pincode ? "Pincode is required" : null,
          },
        },
        { status: 400 }
      );
    }

    const profile = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.data.user?.id)
      .single();

    // // Your business logic here
    const result = await supabase.from("supplier_businesses").insert({
      business_name,
      gst_number,
      business_address,
      city,
      state,
      pincode,
      phone: profile.data?.phone_number + "",
      gst_certificate_url,
      is_verified: false,
      profile_id: profile.data?.id,
      profile_avatar_url,
    });

    return NextResponse.json(
      {
        success: true,
        data: body,
        message: "Operation completed successfully",
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
