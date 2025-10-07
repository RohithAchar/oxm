import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cashfreeService } from "@/lib/services/cashfree";

export const dynamic = "force-dynamic";
export async function POST(
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

    if (!bankDetails.cashfree_reference_id || !bankDetails.cashfree_user_id) {
      return NextResponse.json(
        { error: "No verification reference found" },
        { status: 400 }
      );
    }

    // Check verification status with Cashfree
    try {
      const verificationStatus =
        await cashfreeService.getBankVerificationStatus(
          parseInt(bankDetails.cashfree_reference_id),
          bankDetails.cashfree_user_id.replace(/-/g, "_") // Replace hyphens with underscores for Cashfree
        );

      // Update bank details with verification results
      const updateData = cashfreeService.mapVerificationToBankDetails(
        bankDetails,
        verificationStatus
      );

      const { data: updatedBankDetails, error: updateError } = await supabase
        .from("supplier_bank_details")
        .update(updateData)
        .eq("id", bankDetailsId)
        .select()
        .single();

      if (updateError) {
        console.error("Error updating bank details:", updateError);
        return NextResponse.json(
          { error: "Failed to update verification status" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        bankDetails: updatedBankDetails,
        verificationStatus,
      });
    } catch (verificationError) {
      console.error("Error checking verification status:", verificationError);
      return NextResponse.json(
        { error: "Failed to check verification status" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(
      "Error in POST /api/supplier/bank-details/[id]/verify:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
