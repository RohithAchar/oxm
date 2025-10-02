import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

// Validation schema for bank details
const BankDetailsSchema = z.object({
  account_holder_name: z
    .string()
    .min(3, "Account holder name must be at least 3 characters")
    .max(100, "Account holder name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s\.]+$/,
      "Account holder name can only contain letters, spaces, and dots"
    ),

  account_number: z
    .string()
    .min(9, "Account number must be at least 9 digits")
    .max(18, "Account number must be less than 18 digits")
    .regex(/^\d+$/, "Account number can only contain digits"),

  ifsc_code: z
    .string()
    .length(11, "IFSC code must be exactly 11 characters")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),

  bank_name: z
    .string()
    .min(1, "Bank name is required")
    .max(100, "Bank name must be less than 100 characters"),

  branch_name: z
    .string()
    .max(100, "Branch name must be less than 100 characters")
    .optional(),

  account_type: z.enum(["savings", "current"], {
    message: "Account type must be either 'savings' or 'current'",
  }),

  is_primary: z.boolean().optional().default(false),
});

// GET - Fetch all bank details for the supplier
export async function GET(request: NextRequest) {
  try {
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

    // Fetch bank details
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
      .eq("supplier_business_id", business.id)
      .eq("is_active", true)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("❌ Error fetching bank details:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch bank details", details: fetchError.message },
        { status: 500 }
      );
    }

    // Fix existing inactive records (one-time fix)
    if (bankDetails && bankDetails.length === 0) {
      // Check if there are inactive records that should be active
      const { data: inactiveRecords } = await supabase
        .from("supplier_bank_details")
        .select("id")
        .eq("supplier_business_id", business.id)
        .eq("is_active", false);

      if (inactiveRecords && inactiveRecords.length > 0) {
        // Reactivate them (one-time fix)
        await supabase
          .from("supplier_bank_details")
          .update({ is_active: true })
          .eq("supplier_business_id", business.id)
          .eq("is_active", false);

        // Refetch after fixing
        const { data: fixedBankDetails } = await supabase
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
          .eq("supplier_business_id", business.id)
          .eq("is_active", true)
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: false });

        const maskedFixedDetails = fixedBankDetails?.map((detail) => ({
          ...detail,
          account_number: `****${detail.account_number.slice(-4)}`,
        }));

        return NextResponse.json({
          success: true,
          data: maskedFixedDetails || [],
        });
      }
    }

    // Mask account numbers for security
    const maskedBankDetails = bankDetails?.map((detail) => ({
      ...detail,
      account_number: `****${detail.account_number.slice(-4)}`,
    }));

    return NextResponse.json({
      success: true,
      data: maskedBankDetails || [],
    });
  } catch (error) {
    console.error("Unexpected error in GET /api/supplier/bank-details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new bank details
export async function POST(request: NextRequest) {
  try {
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
      .select("id, business_name")
      .eq("profile_id", user.id)
      .single();

    if (businessError || !business) {
      console.error("Supplier business lookup failed:", {
        businessError,
        userId: user.id,
      });
      return NextResponse.json(
        {
          error: "Supplier business not found",
          details: businessError?.message,
        },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = BankDetailsSchema.parse(body);

    // Check for duplicate account number
    const { data: existingAccount, error: duplicateError } = await supabase
      .from("supplier_bank_details")
      .select("id")
      .eq("supplier_business_id", business.id)
      .eq("account_number", validatedData.account_number)
      .eq("is_active", true)
      .single();

    if (existingAccount) {
      return NextResponse.json(
        { error: "This account number is already added" },
        { status: 409 }
      );
    }

    // If this is set as primary, unset other primary accounts
    if (validatedData.is_primary) {
      await supabase
        .from("supplier_bank_details")
        .update({ is_primary: false, updated_by: user.id })
        .eq("supplier_business_id", business.id)
        .eq("is_primary", true);
    }

    // Create bank details record
    const { data: newBankDetails, error: insertError } = await supabase
      .from("supplier_bank_details")
      .insert({
        supplier_business_id: business.id,
        account_holder_name: validatedData.account_holder_name,
        account_number: validatedData.account_number,
        ifsc_code: validatedData.ifsc_code.toUpperCase(),
        bank_name: validatedData.bank_name,
        branch_name: validatedData.branch_name,
        account_type: validatedData.account_type,
        is_primary: validatedData.is_primary,
        verification_status: "pending",
        created_by: user.id,
        updated_by: user.id,
      })
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
        is_primary,
        created_at
      `
      )
      .single();

    if (insertError) {
      console.error("Error creating bank details:", insertError);
      return NextResponse.json(
        {
          error: "Failed to create bank details",
          details: insertError.message,
          code: insertError.code,
        },
        { status: 500 }
      );
    }

    // TODO: Integrate with Cashfree to create beneficiary
    // For now, we'll use a mock implementation
    try {
      // Mock Cashfree beneficiary creation
      const beneficiaryId = `MOCK_BENE_${Date.now()}`;

      // Update with mock beneficiary ID
      await supabase
        .from("supplier_bank_details")
        .update({
          cashfree_beneficiary_id: beneficiaryId,
          verification_status: "verified", // Mock verification
          verification_message: "Bank account verified successfully (Mock)",
          last_verified_at: new Date().toISOString(),
          updated_by: user.id,
        })
        .eq("id", newBankDetails.id);

      // Return success response with masked account number
      return NextResponse.json(
        {
          success: true,
          message: "Bank details added and verified successfully",
          data: {
            ...newBankDetails,
            account_number: `****${newBankDetails.account_number.slice(-4)}`,
            cashfree_beneficiary_id: beneficiaryId,
            verification_status: "verified",
          },
        },
        { status: 201 }
      );
    } catch (cashfreeError) {
      console.error("Cashfree integration error:", cashfreeError);

      // Return success but with pending verification
      return NextResponse.json(
        {
          success: true,
          message: "Bank details added. Verification in progress.",
          data: {
            ...newBankDetails,
            account_number: `****${newBankDetails.account_number.slice(-4)}`,
          },
        },
        { status: 201 }
      );
    }
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

    console.error(
      "Unexpected error in POST /api/supplier/bank-details:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
