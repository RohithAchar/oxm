// app/api/(products)/product-specifications/route.ts

import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type ProductSpecificationInsert =
  Database["public"]["Tables"]["product_specifications"]["Insert"];

export async function POST(req: NextRequest) {
  try {
    // const supabase = await createClient();
    // // Parse request body
    // const body = await req.json();

    // // Input validation
    // const {
    //   product_id,
    //   spec_name,
    //   spec_value,
    //   spec_unit,
    //   display_order,
    // }: ProductSpecificationInsert = body;

    // if (!product_id) {
    //   return NextResponse.json(
    //     {
    //       error: "Product ID is required",
    //       message: "Please provide a valid product ID",
    //     },
    //     { status: 400 }
    //   );
    // }

    // if (!spec_name) {
    //   return NextResponse.json(
    //     {
    //       error: "Specification name is required",
    //       message: "Please provide a valid specification name",
    //     },
    //     { status: 400 }
    //   );
    // }

    // if (!spec_value) {
    //   return NextResponse.json(
    //     {
    //       error: "Specification value is required",
    //       message: "Please provide a valid specification value",
    //     },
    //     { status: 400 }
    //   );
    // }

    // const { data: user } = await supabase.auth.getUser();

    // if (!user) {
    //   return NextResponse.json(
    //     {
    //       error: "Unauthorized",
    //       message: "You are not authorized to perform this action",
    //     },
    //     { status: 401 }
    //   );
    // }

    // const { data: product, error: productError } = await supabase
    //   .from("products")
    //   .select("*")
    //   .eq("id", product_id)
    //   .single();

    // if (!product) {
    //   return NextResponse.json(
    //     {
    //       error: "Product not found",
    //       message: "The specified product was not found",
    //     },
    //     { status: 404 }
    //   );
    // }

    // if (productError) {
    //   return NextResponse.json(
    //     {
    //       error: "Error fetching product",
    //       message: "An error occurred while fetching the product",
    //     },
    //     { status: 500 }
    //   );
    // }

    // const result = await supabase
    //   .from("product_specifications")
    //   .insert({
    //     product_id,
    //     spec_name,
    //     spec_value,
    //     spec_unit,
    //     display_order,
    //   })
    //   .select("id")
    //   .single();

    // return NextResponse.json(
    //   {
    //     success: true,
    //     id: result.data?.id,
    //     message: "Operation completed successfully",
    //   },
    //   { status: 200 }
    // );
    return NextResponse.json({ success: true });
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
