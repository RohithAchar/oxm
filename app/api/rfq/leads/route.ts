import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "buyer" or "supplier"
    const statusParam = searchParams.get("status"); // optional filter
    type Status = "submitted" | "viewed" | "responded" | "closed" | "cancelled";
    const allowedStatuses: ReadonlyArray<Status> = [
      "submitted",
      "viewed",
      "responded",
      "closed",
      "cancelled",
    ];
    const status: Status | undefined =
      statusParam &&
      (allowedStatuses as readonly string[]).includes(statusParam)
        ? (statusParam as Status)
        : undefined;

    let query = supabase.from("buy_leads").select(`
        *,
        product_snapshot,
        buyer_snapshot
      `);

    if (type === "buyer") {
      query = query.eq("buyer_id", user.id);
    } else if (type === "supplier") {
      query = query.eq("supplier_id", user.id);
    } else {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 }
      );
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching buy leads:", error);
      return NextResponse.json(
        { error: "Failed to fetch buy leads" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      supplier_id,
      product_id,
      product_name,
      supplier_name,
      quantity_required,
      target_price,
      delivery_pincode,
      delivery_city,
      customization,
      notes,
      contact_email,
      contact_phone,
      tier_pricing_snapshot,
      currency = "INR",
    } = body;

    // Validate required fields
    if (!supplier_id) {
      return NextResponse.json(
        { error: "Supplier ID is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("buy_leads")
      .insert({
        buyer_id: user.id,
        supplier_id,
        product_id: product_id || null,
        product_name: product_name || null,
        supplier_name: supplier_name || null,
        quantity_required: quantity_required ? Number(quantity_required) : null,
        target_price: target_price ? Number(target_price) : null,
        delivery_pincode: delivery_pincode || null,
        delivery_city: delivery_city || null,
        customization: customization || null,
        notes: notes || null,
        contact_email: contact_email || null,
        contact_phone: contact_phone || null,
        tier_pricing_snapshot: tier_pricing_snapshot || null,
        currency,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating buy lead:", error);
      return NextResponse.json(
        { error: "Failed to create buy lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
