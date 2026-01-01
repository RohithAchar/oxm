import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cashfreeService } from "@/lib/services/cashfree";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await req.json();
    const {
      beneficiary_id,
      beneficiary_name,
      beneficiary_instrument_details,
      beneficiary_contact_details,
    } = body;

    // Validate required fields
    if (
      !beneficiary_id ||
      !beneficiary_name ||
      !beneficiary_instrument_details ||
      !beneficiary_instrument_details.bank_account_number ||
      !beneficiary_instrument_details.bank_ifsc
    ) {
      return NextResponse.json(
        {
          error:
            "beneficiary_id, beneficiary_name, bank_account_number, and bank_ifsc are required",
        },
        { status: 400 }
      );
    }

    // Look up supplier_business for this user
    const { data: supplierBusiness, error: sbError } = await supabase
      .from("supplier_businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (sbError || !supplierBusiness) {
      return NextResponse.json(
        { error: "Supplier business not found" },
        { status: 404 }
      );
    }

    // Prepare payload for Cashfree
    const payload = {
      beneficiary_id,
      beneficiary_name,
      beneficiary_instrument_details: {
        bank_account_number: beneficiary_instrument_details.bank_account_number,
        bank_ifsc: beneficiary_instrument_details.bank_ifsc.toUpperCase(),
        vpa: beneficiary_instrument_details.vpa || null,
      },
      beneficiary_contact_details: {
        beneficiary_email:
          beneficiary_contact_details.beneficiary_email || null,
        beneficiary_phone:
          beneficiary_contact_details.beneficiary_phone || null,
        beneficiary_country_code:
          beneficiary_contact_details.beneficiary_country_code || "+91",
        beneficiary_address:
          beneficiary_contact_details.beneficiary_address || null,
        beneficiary_city: beneficiary_contact_details.beneficiary_city || null,
        beneficiary_state:
          beneficiary_contact_details.beneficiary_state || null,
        beneficiary_postal_code:
          beneficiary_contact_details.beneficiary_postal_code || null,
      },
    };

    // Call Cashfree API
    const cfResponse = await cashfreeService.createPayoutBeneficiary(payload);

    // Store in our database
    const { data: beneficiary, error: insertError } = await supabase
      .from("supplier_payout_beneficiaries")
      .insert({
        supplier_business_id: supplierBusiness.id,
        cashfree_beneficiary_id: cfResponse.beneficiary_id,
        beneficiary_status: cfResponse.beneficiary_status,
        added_on: cfResponse.added_on,
        beneficiary_name: cfResponse.beneficiary_name,
        bank_account_number:
          cfResponse.beneficiary_instrument_details.bank_account_number,
        bank_ifsc: cfResponse.beneficiary_instrument_details.bank_ifsc,
        vpa: cfResponse.beneficiary_instrument_details.vpa || null,
        beneficiary_email:
          cfResponse.beneficiary_contact_details.beneficiary_email || null,
        beneficiary_phone:
          cfResponse.beneficiary_contact_details.beneficiary_phone || null,
        beneficiary_country_code:
          cfResponse.beneficiary_contact_details.beneficiary_country_code ||
          null,
        beneficiary_address:
          cfResponse.beneficiary_contact_details.beneficiary_address || null,
        beneficiary_city:
          cfResponse.beneficiary_contact_details.beneficiary_city || null,
        beneficiary_state:
          cfResponse.beneficiary_contact_details.beneficiary_state || null,
        beneficiary_postal_code:
          cfResponse.beneficiary_contact_details.beneficiary_postal_code ||
          null,
        raw_response: cfResponse,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error storing beneficiary:", insertError);
      return NextResponse.json(
        {
          error: "Failed to store beneficiary",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    // Revalidate the payout beneficiary page
    revalidatePath("/supplier/payout-beneficiary");

    return NextResponse.json({
      success: true,
      beneficiary: cfResponse,
      stored: beneficiary,
    });
  } catch (error: any) {
    console.error("Error creating payout beneficiary:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get supplier business for the user
    const { data: supplierBusiness } = await supabase
      .from("supplier_businesses")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (!supplierBusiness) {
      return NextResponse.json(
        { error: "Supplier business not found" },
        { status: 404 }
      );
    }

    // Get beneficiaries for the supplier
    const { data: beneficiaries, error } = await supabase
      .from("supplier_payout_beneficiaries")
      .select("*")
      .eq("supplier_business_id", supplierBusiness.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching beneficiaries:", error);
      return NextResponse.json(
        { error: "Failed to fetch beneficiaries" },
        { status: 500 }
      );
    }

    return NextResponse.json({ beneficiaries: beneficiaries || [] });
  } catch (error) {
    console.error("Error in GET /api/supplier/payout-beneficiary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
