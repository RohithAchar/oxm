import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("buy_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching buy lead:", error);
      return NextResponse.json(
        { error: "Buy lead not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this buy lead
    if (data.buyer_id !== user.id && data.supplier_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    // First, check if the buy lead exists and user has access
    const { data: existingLead, error: fetchError } = await supabase
      .from("buy_leads")
      .select("buyer_id, supplier_id, status")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Buy lead not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this buy lead
    if (
      existingLead.buyer_id !== user.id &&
      existingLead.supplier_id !== user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the buy lead
    const { data, error } = await supabase
      .from("buy_leads")
      .update({
        status: status || existingLead.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating buy lead:", error);
      return NextResponse.json(
        { error: "Failed to update buy lead" },
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
