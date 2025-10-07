import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cashfreeService } from "@/lib/services/cashfree";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get supplier business for the user
    const { data: supplierBusiness } = await supabase
      .from("supplier_businesses")
      .select("id")
      .eq("profile_id", user.user.id)
      .single();

    if (!supplierBusiness) {
      return NextResponse.json(
        { error: "Supplier business not found" },
        { status: 404 }
      );
    }

    // Get bank details for the supplier
    const { data: bankDetails, error } = await supabase
      .from("supplier_bank_details")
      .select("*")
      .eq("supplier_business_id", supplierBusiness.id)
      .eq("is_active", true)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bank details:", error);
      return NextResponse.json(
        { error: "Failed to fetch bank details" },
        { status: 500 }
      );
    }

    return NextResponse.json({ bankDetails });
  } catch (error) {
    console.error("Error in GET /api/supplier/bank-details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      account_holder_name,
      account_number,
      ifsc_code,
      account_type = "savings",
      phone,
      is_primary = false,
    } = body;

    // Validate required fields
    if (!account_holder_name || !account_number || !ifsc_code) {
      return NextResponse.json(
        {
          error:
            "Account holder name, account number, and IFSC code are required",
        },
        { status: 400 }
      );
    }

    // Get supplier business for the user
    const { data: supplierBusiness } = await supabase
      .from("supplier_businesses")
      .select("id")
      .eq("profile_id", user.user.id)
      .single();

    if (!supplierBusiness) {
      return NextResponse.json(
        { error: "Supplier business not found" },
        { status: 404 }
      );
    }

    // If setting as primary, unset other primary accounts
    if (is_primary) {
      await supabase
        .from("supplier_bank_details")
        .update({ is_primary: false })
        .eq("supplier_business_id", supplierBusiness.id);
    }

    // Create bank details record
    const { data: bankDetails, error: insertError } = await supabase
      .from("supplier_bank_details")
      .insert({
        supplier_business_id: supplierBusiness.id,
        account_holder_name,
        account_number,
        ifsc_code,
        account_type,
        phone: phone || null, // Convert empty string to null
        is_primary,
        verification_status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting bank details:", insertError);
      return NextResponse.json(
        { error: "Failed to save bank details" },
        { status: 500 }
      );
    }

    // Initiate Cashfree verification
    try {
      const verificationRequest = {
        bank_account: account_number,
        ifsc: ifsc_code,
        name: account_holder_name,
        user_id: bankDetails.id.replace(/-/g, "_"), // Replace hyphens with underscores for Cashfree
        phone: phone || "9999999999", // Use default phone if not provided
      };

      const verificationResponse = await cashfreeService.verifyBankAccount(
        verificationRequest
      );

      // Update bank details with Cashfree reference
      await supabase
        .from("supplier_bank_details")
        .update({
          cashfree_reference_id: verificationResponse.reference_id.toString(),
          cashfree_user_id: verificationResponse.user_id,
          verification_status: "validating",
        })
        .eq("id", bankDetails.id);

      return NextResponse.json({
        bankDetails: {
          ...bankDetails,
          cashfree_reference_id: verificationResponse.reference_id.toString(),
          cashfree_user_id: verificationResponse.user_id,
          verification_status: "validating",
        },
        verificationInitiated: true,
      });
    } catch (verificationError) {
      console.error("Error initiating verification:", verificationError);
      // Still return the bank details even if verification fails
      return NextResponse.json({
        bankDetails,
        verificationInitiated: false,
        verificationError: "Failed to initiate verification",
      });
    }
  } catch (error) {
    console.error("Error in POST /api/supplier/bank-details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
