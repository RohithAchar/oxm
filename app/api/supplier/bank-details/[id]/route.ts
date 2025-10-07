import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bankDetailsId } = await params;
    const body = await req.json();
    const { is_primary } = body;

    // Get bank details and verify ownership
    const { data: bankDetails, error: fetchError } = await supabase
      .from("supplier_bank_details")
      .select(
        `
        *,
        supplier_businesses!inner(profile_id)
      `
      )
      .eq("id", bankDetailsId)
      .eq("supplier_businesses.profile_id", user.user.id)
      .single();

    if (fetchError || !bankDetails) {
      return NextResponse.json(
        { error: "Bank details not found" },
        { status: 404 }
      );
    }

    // If setting as primary, unset other primary accounts
    if (is_primary) {
      await supabase
        .from("supplier_bank_details")
        .update({ is_primary: false })
        .eq("supplier_business_id", bankDetails.supplier_business_id);
    }

    // Update bank details
    const { data: updatedBankDetails, error: updateError } = await supabase
      .from("supplier_bank_details")
      .update({ is_primary })
      .eq("id", bankDetailsId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating bank details:", updateError);
      return NextResponse.json(
        { error: "Failed to update bank details" },
        { status: 500 }
      );
    }

    return NextResponse.json({ bankDetails: updatedBankDetails });
  } catch (error) {
    console.error("Error in PUT /api/supplier/bank-details/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: bankDetailsId } = await params;

    // Get bank details and verify ownership
    const { data: bankDetails, error: fetchError } = await supabase
      .from("supplier_bank_details")
      .select(
        `
        *,
        supplier_businesses!inner(profile_id)
      `
      )
      .eq("id", bankDetailsId)
      .eq("supplier_businesses.profile_id", user.user.id)
      .single();

    if (fetchError || !bankDetails) {
      return NextResponse.json(
        { error: "Bank details not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting is_active to false
    const { error: deleteError } = await supabase
      .from("supplier_bank_details")
      .update({ is_active: false })
      .eq("id", bankDetailsId);

    if (deleteError) {
      console.error("Error deleting bank details:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete bank details" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/supplier/bank-details/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
