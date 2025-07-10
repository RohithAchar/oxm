// app/api/(products)/product-images/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

// Updated interface for API route context
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    // Await the params to get the actual values
    const { id } = await context.params;

    // Your existing DELETE logic here
    console.log("Deleting product image with ID:", id);

    // Example logic (replace with your actual implementation)
    // await deleteProductImage(id);

    return NextResponse.json({
      message: "Product image deleted successfully",
      id,
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    return NextResponse.json(
      { error: "Failed to delete product image" },
      { status: 500 }
    );
  }
}

// If you have other HTTP methods, apply the same pattern
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Your GET logic here
    console.log("Getting product image with ID:", id);

    return NextResponse.json({
      message: "Product image retrieved successfully",
      id,
    });
  } catch (error) {
    console.error("Error getting product image:", error);
    return NextResponse.json(
      { error: "Failed to get product image" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Your PUT logic here
    console.log("Updating product image with ID:", id);

    return NextResponse.json({
      message: "Product image updated successfully",
      id,
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    return NextResponse.json(
      { error: "Failed to update product image" },
      { status: 500 }
    );
  }
}
