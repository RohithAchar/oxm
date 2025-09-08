// app/api/(products)/products/route.ts

import { Database } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export async function POST(req: NextRequest) {
  try {
    // const supabase = await createClient();
    // // Parse request body
    // const body = await req.json();

    // // Input validation
    // const {
    //   brand,
    //   breadth,
    //   category_id,
    //   subcategory_id,
    //   country_of_origin,
    //   description,
    //   height,
    //   hsn_code,

    //   is_sample_available,
    //   length,
    //   name,

    //   supplier_id,
    //   weight,
    // }: ProductInsert = body;

    // const errors: Record<string, string | null> = {};

    // // Required string fields
    // if (!name) errors.name = "Product name is required";
    // if (!category_id) errors.category_id = "Category is required";
    // if (!subcategory_id) errors.subcategory_id = "Sub category is required";

    // if (!supplier_id) errors.supplier_id = "Supplier ID is required";

    // // Numeric validations
    // if (weight != null && (isNaN(weight) || weight < 0)) {
    //   errors.weight = "Weight must be a non-negative number";
    // }
    // if (length != null && (isNaN(length) || length < 0)) {
    //   errors.length = "Length must be a non-negative number";
    // }
    // if (breadth != null && (isNaN(breadth) || breadth < 0)) {
    //   errors.breadth = "Breadth must be a non-negative number";
    // }
    // if (height != null && (isNaN(height) || height < 0)) {
    //   errors.height = "Height must be a non-negative number";
    // }

    // // Optional string fields
    // if (brand != null && typeof brand !== "string") {
    //   errors.brand = "Brand must be a string";
    // }
    // if (description != null && typeof description !== "string") {
    //   errors.description = "Description must be a string";
    // }
    // if (hsn_code != null && typeof hsn_code !== "string") {
    //   errors.hsn_code = "HSN Code must be a string";
    // }
    // if (country_of_origin != null && typeof country_of_origin !== "string") {
    //   errors.country_of_origin = "Country of origin must be a string";
    // }

    // // Boolean checks
    // if (typeof is_sample_available !== "boolean") {
    //   errors.is_sample_available = "is_sample_available must be a boolean";
    // }

    // // Remove nulls from errors
    // Object.keys(errors).forEach((key) => {
    //   if (errors[key] === null) delete errors[key];
    // });

    // if (Object.keys(errors).length > 0) {
    //   return NextResponse.json(
    //     {
    //       error: "Validation failed",
    //       message: "Please fix the errors in the form",
    //       fields: errors,
    //     },
    //     { status: 400 }
    //   );
    // }
    // // Your business logic here
    // const result = await supabase
    //   .from("products")
    //   .insert(body)
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

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "User not authorized" },
        { status: 401 }
      );
    }

    // Your business logic here
    const result = await supabase
      .from("products")
      .select("*")
      .eq("supplier_id", user.id);

    return NextResponse.json(
      {
        success: true,
        result,
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
