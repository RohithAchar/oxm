import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

// Validation schema for bank details update
const UpdateBankDetailsSchema = z.object({
  account_holder_name: z
    .string()
    .min(3, "Account holder name must be at least 3 characters")
    .max(100, "Account holder name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s\.]+$/,
      "Account holder name can only contain letters, spaces, and dots"
    )
    .optional(),

  account_number: z
    .string()
    .min(9, "Account number must be at least 9 digits")
    .max(18, "Account number must be less than 18 digits")
    .regex(/^\d+$/, "Account number can only contain digits")
    .optional(),

  ifsc_code: z
    .string()
    .length(11, "IFSC code must be exactly 11 characters")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .optional(),

  bank_name: z
    .string()
    .min(1, "Bank name is required")
    .max(100, "Bank name must be less than 100 characters")
    .optional(),

  branch_name: z
    .string()
    .max(100, "Branch name must be less than 100 characters")
    .optional(),

  account_type: z
    .enum(["savings", "current"], {
      errorMap: () => ({
        message: "Account type must be either 'savings' or 'current'",
      }),
    })
    .optional(),

  is_primary: z.boolean().optional(),
});

// GET - Fetch specific bank details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get supplier business
    const { data: business, error: businessError } = await supabase
      .from("supplier_businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: "Supplier business not found" },
        { status: 404 }
      );
    }

    // Fetch specific bank details
    const { data: bankDetails, error: fetchError } = await supabase
      .from("supplier_bank_details")
      .select(
        `
        id,
        account_holder_name,
        account_number,
        ifsc_code,
        bank_name,
        branch_name,
        account_type,
        verification_status,
        verification_message,
        is_primary,
        is_active,
        created_at,
        updated_at,
        last_verified_at
      `
      )
      .eq("id", id)
      .eq("supplier_business_id", business.id)
      .eq("is_active", true)
      .single();

    if (fetchError || !bankDetails) {
      return NextResponse.json(
        { error: "Bank details not found" },
        { status: 404 }
      );
    }

    // Mask account number for security
    const maskedBankDetails = {
      ...bankDetails,
      account_number: `****${bankDetails.account_number.slice(-4)}`,
    };

    return NextResponse.json({
      success: true,
      data: maskedBankDetails,
    });
  } catch (error) {
    console.error(
      "Unexpected error in GET /api/supplier/bank-details/[id]:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update bank details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get supplier business
    const { data: business, error: businessError } = await supabase
      .from("supplier_businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: "Supplier business not found" },
        { status: 404 }
      );
    }

    // Check if bank details exist and belong to the supplier
    const { data: existingBankDetails, error: existsError } = await supabase
      .from("supplier_bank_details")
      .select("id, account_number, verification_status")
      .eq("id", id)
      .eq("supplier_business_id", business.id)
      .eq("is_active", true)
      .single();

    if (existsError || !existingBankDetails) {
      return NextResponse.json(
        { error: "Bank details not found" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateBankDetailsSchema.parse(body);

    // If account number is being changed, check for duplicates
    if (
      validatedData.account_number &&
      validatedData.account_number !== existingBankDetails.account_number
    ) {
      const { data: duplicateAccount } = await supabase
        .from("supplier_bank_details")
        .select("id")
        .eq("supplier_business_id", business.id)
        .eq("account_number", validatedData.account_number)
        .eq("is_active", true)
        .neq("id", id)
        .single();

      if (duplicateAccount) {
        return NextResponse.json(
          { error: "This account number is already added" },
          { status: 409 }
        );
      }
    }

    // If this is being set as primary, unset other primary accounts
    if (validatedData.is_primary === true) {
      await supabase
        .from("supplier_bank_details")
        .update({ is_primary: false, updated_by: user.id })
        .eq("supplier_business_id", business.id)
        .eq("is_primary", true)
        .neq("id", id);
    }

    // Prepare update data
    const updateData: any = {
      updated_by: user.id,
    };

    // Only include fields that are being updated
    if (validatedData.account_holder_name !== undefined) {
      updateData.account_holder_name = validatedData.account_holder_name;
    }
    if (validatedData.account_number !== undefined) {
      updateData.account_number = validatedData.account_number;
      // Reset verification if account number changed
      updateData.verification_status = "pending";
      updateData.verification_message = null;
      updateData.cashfree_beneficiary_id = null;
    }
    if (validatedData.ifsc_code !== undefined) {
      updateData.ifsc_code = validatedData.ifsc_code.toUpperCase();
    }
    if (validatedData.bank_name !== undefined) {
      updateData.bank_name = validatedData.bank_name;
    }
    if (validatedData.branch_name !== undefined) {
      updateData.branch_name = validatedData.branch_name;
    }
    if (validatedData.account_type !== undefined) {
      updateData.account_type = validatedData.account_type;
    }
    if (validatedData.is_primary !== undefined) {
      updateData.is_primary = validatedData.is_primary;
    }

    // Update bank details
    const { data: updatedBankDetails, error: updateError } = await supabase
      .from("supplier_bank_details")
      .update(updateData)
      .eq("id", id)
      .eq("supplier_business_id", business.id)
      .select(
        `
        id,
        account_holder_name,
        account_number,
        ifsc_code,
        bank_name,
        branch_name,
        account_type,
        verification_status,
        verification_message,
        is_primary,
        updated_at
      `
      )
      .single();

    if (updateError) {
      console.error("Error updating bank details:", updateError);
      return NextResponse.json(
        { error: "Failed to update bank details" },
        { status: 500 }
      );
    }

    // TODO: If critical details changed, re-verify with Cashfree
    if (validatedData.account_number || validatedData.ifsc_code) {
      try {
        // Mock Cashfree re-verification
        const beneficiaryId = `MOCK_BENE_${Date.now()}`;

        await supabase
          .from("supplier_bank_details")
          .update({
            cashfree_beneficiary_id: beneficiaryId,
            verification_status: "verified",
            verification_message:
              "Bank account re-verified successfully (Mock)",
            last_verified_at: new Date().toISOString(),
            updated_by: user.id,
          })
          .eq("id", id);

        updatedBankDetails.verification_status = "verified";
        updatedBankDetails.cashfree_beneficiary_id = beneficiaryId;
      } catch (cashfreeError) {
        console.error("Cashfree re-verification error:", cashfreeError);
      }
    }

    // Return success response with masked account number
    return NextResponse.json({
      success: true,
      message: "Bank details updated successfully",
      data: {
        ...updatedBankDetails,
        account_number: `****${updatedBankDetails.account_number.slice(-4)}`,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error(
      "Unexpected error in PUT /api/supplier/bank-details/[id]:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete bank details
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get supplier business
    const { data: business, error: businessError } = await supabase
      .from("supplier_businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: "Supplier business not found" },
        { status: 404 }
      );
    }

    // Check if bank details exist and belong to the supplier
    const { data: existingBankDetails, error: existsError } = await supabase
      .from("supplier_bank_details")
      .select("id, is_primary")
      .eq("id", id)
      .eq("supplier_business_id", business.id)
      .eq("is_active", true)
      .single();

    if (existsError || !existingBankDetails) {
      return NextResponse.json(
        { error: "Bank details not found" },
        { status: 404 }
      );
    }

    // Check if there are other active bank accounts
    const { data: otherAccounts, error: countError } = await supabase
      .from("supplier_bank_details")
      .select("id")
      .eq("supplier_business_id", business.id)
      .eq("is_active", true)
      .neq("id", id);

    if (countError) {
      console.error("Error checking other accounts:", countError);
      return NextResponse.json(
        { error: "Failed to verify account deletion" },
        { status: 500 }
      );
    }

    // If this is the primary account and there are other accounts,
    // we need to set another account as primary
    if (
      existingBankDetails.is_primary &&
      otherAccounts &&
      otherAccounts.length > 0
    ) {
      // Set the first other account as primary
      await supabase
        .from("supplier_bank_details")
        .update({ is_primary: true, updated_by: user.id })
        .eq("id", otherAccounts[0].id);
    }

    // Soft delete the bank details (set is_active to false)
    const { error: deleteError } = await supabase
      .from("supplier_bank_details")
      .update({
        is_active: false,
        is_primary: false,
        updated_by: user.id,
      })
      .eq("id", id)
      .eq("supplier_business_id", business.id);

    if (deleteError) {
      console.error("Error deleting bank details:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete bank details" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bank details deleted successfully",
    });
  } catch (error) {
    console.error(
      "Unexpected error in DELETE /api/supplier/bank-details/[id]:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
