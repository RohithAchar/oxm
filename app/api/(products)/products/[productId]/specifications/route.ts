import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface PageProps {
  params: Promise<{ productId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function DELETE(req: Request, { params }: PageProps) {
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

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (!product) {
      return new Response("Product not found", { status: 404 });
    }

    const { data: specifications, error: specError } = await supabase
      .from("product_specifications")
      .select("*")
      .eq("product_id", productId)
      .order("display_order", { ascending: true });

    if (specError) {
      return new Response("Error fetching specifications", { status: 500 });
    }

    await supabase
      .from("product_specifications")
      .delete()
      .eq("product_id", productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
