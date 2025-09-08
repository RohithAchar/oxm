import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// TODO: Restrict only for admin users
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("supplier_businesses")
      .select("*");

    if (error) {
      console.error("Error fetching businesses:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        data: data,
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
