import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { verifyBankAccount } from "@/lib/services/cashfree";

// Validation schema for verification request
const verifyBankSchema = z.object({
  verification_method: z.enum(["penny_drop", "manual", "document"]),
  admin_notes: z.string().optional(),
});

// POST - Initiate bank account verification
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = verifyBankSchema.parse(body);
    const bankDetailsId = params.id;

    // Get bank details
    const { data: bankDetails, error: fetchError } = await supabase
      .from("supplier_bank_details")
      .select("*")
      .eq("id", bankDetailsId)
      .single();

    if (fetchError || !bankDetails) {
      return NextResponse.json(
        { error: "Bank details not found" },
        { status: 404 }
      );
    }

    // Check if user owns this bank account or is admin
    const { data: business, error: businessError } = await supabase
      .from("supplier_businesses")
      .select("profile_id")
      .eq("id", bankDetails.supplier_business_id)
      .single();

    if (businessError || (business.profile_id !== user.id && !isAdmin(user))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let verificationResult;
    let newStatus = "pending";
    let verificationMessage = "Verification initiated";

    // Handle different verification methods
    switch (validatedData.verification_method) {
      case "penny_drop":
        verificationResult = await verifyBankAccount({
          account_number: bankDetails.account_number,
          ifsc_code: bankDetails.ifsc_code,
          account_holder_name: bankDetails.account_holder_name,
        });
        newStatus = verificationResult.success ? "verified" : "failed";
        verificationMessage = verificationResult.message;
        break;

      case "manual":
        // Admin manual verification
        if (!isAdmin(user)) {
          return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
          );
        }
        newStatus = "verified";
        verificationMessage = `Manually verified by admin. ${
          validatedData.admin_notes || ""
        }`;
        break;

      case "document":
        // Document-based verification (future implementation)
        newStatus = "pending";
        verificationMessage = "Document verification pending review";
        break;
    }

    // Update bank details with verification result
    const { data: updatedBankDetails, error: updateError } = await supabase
      .from("supplier_bank_details")
      .update({
        verification_status: newStatus,
        verification_message: verificationMessage,
        last_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: user.id,
      })
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

    // Log verification attempt in audit table
    await supabase.from("supplier_bank_details_audit").insert({
      bank_details_id: bankDetailsId,
      action: "verified",
      new_data: {
        verification_status: newStatus,
        verification_method: validatedData.verification_method,
        verification_message: verificationMessage,
      },
      changed_by: user.id,
      changed_at: new Date().toISOString(),
      ip_address: request.headers.get("x-forwarded-for") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      data: updatedBankDetails,
      verification_result: verificationResult,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Bank verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to check if user is admin
function isAdmin(user: any): boolean {
  // Implement your admin check logic here
  // For now, return false - you can add admin role checking later
  return false;
}
