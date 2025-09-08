// app/api/categories/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET all categories
export async function GET() {
  try {
    const supabase = await createClient();

    // in alphabetic order and without the parent category
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
