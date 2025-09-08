import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface PageProps {
  params: Promise<{ productId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 👇 Fix: `params` argument gives you dynamic route values
export async function GET(req: Request, { params }: PageProps) {
  try {
    const { productId } = await params;
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new Response("Product ID not found", { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    const { data: productImages } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (error) {
      return new Response("Error fetching product", { status: 500 });
    }

    return NextResponse.json({ data, productImages });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: PageProps) {
  try {
    const { productId } = await params;
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new Response("Product ID not found", { status: 400 });
    }

    const body = await req.json(); // 👈 Fix: use req.json() in App Router

    const { error } = await supabase
      .from("products")
      .update(body)
      .eq("id", productId);

    if (error) {
      return new Response("Error updating product", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
