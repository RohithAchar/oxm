import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cashfreeService } from "@/lib/services/cashfree";

export const dynamic = "force-dynamic";
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

    return NextResponse.json(
      { bankDetails },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          SurrogateControl: "no-store",
        },
      }
    );
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

    // First: Initiate Cashfree verification (do NOT save yet)
    // Cashfree requires user_id <= 40 chars and it must be unique. Use compact prefix + UUID (32) + short suffix
    const baseUserId = `sb_${supplierBusiness.id.replace(/-/g, "")}`; // ~35 chars
    const shortSuffix = `_${Date.now().toString(36).slice(-6)}`; // 7 chars including underscore
    let tempUserId = `${baseUserId}${shortSuffix}`;
    if (tempUserId.length > 40) {
      tempUserId = tempUserId.slice(0, 40);
    }
    const verificationRequest = {
      bank_account: account_number,
      ifsc: (ifsc_code || "").toUpperCase(),
      name: account_holder_name,
      user_id: tempUserId,
      phone: phone || "9999999999",
    };

    try {
      const verificationResponse = await cashfreeService.verifyBankAccount(
        verificationRequest
      );

      // Poll verification status briefly to determine result
      const referenceId = verificationResponse.reference_id;
      const userId = verificationResponse.user_id;

      // Small helper to wait
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      let finalStatus: {
        account_status: string;
        account_status_code: string;
        payload: any;
      } | null = null;

      for (let attempt = 0; attempt < 5; attempt++) {
        const status = await cashfreeService.getBankVerificationStatus(
          referenceId,
          userId
        );

        if (
          status.account_status === "VALID" ||
          status.account_status === "INVALID"
        ) {
          finalStatus = {
            account_status: status.account_status,
            account_status_code: status.account_status_code,
            payload: status,
          };
          break;
        }

        // If still RECEIVED/processing, wait and retry
        await delay(1000);
      }

      // If no conclusive result yet, do not save
      if (!finalStatus) {
        return NextResponse.json(
          {
            error:
              "Bank verification is still processing. Please try again in a moment.",
            reference_id: referenceId,
            user_id: userId,
          },
          { status: 202 }
        );
      }

      if (finalStatus.account_status !== "VALID") {
        return NextResponse.json(
          {
            error: "Bank verification failed",
            reason: finalStatus.account_status_code,
          },
          { status: 400 }
        );
      }

      // If setting as primary, unset other primary accounts
      if (is_primary) {
        await supabase
          .from("supplier_bank_details")
          .update({ is_primary: false })
          .eq("supplier_business_id", supplierBusiness.id);
      }

      // Save only after positive verification
      const verifiedPayload: any = finalStatus.payload;

      const { data: bankDetails, error: insertError } = await supabase
        .from("supplier_bank_details")
        .insert({
          supplier_business_id: supplierBusiness.id,
          account_holder_name,
          account_number,
          ifsc_code,
          account_type,
          phone: phone || null,
          is_primary,
          cashfree_reference_id: referenceId.toString(),
          cashfree_user_id: userId,
          verification_status: "valid",
          verification_message: verifiedPayload.account_status_code,
          name_at_bank: verifiedPayload.name_at_bank,
          bank_name: verifiedPayload.bank_name,
          bank_city: verifiedPayload.city,
          bank_branch: verifiedPayload.branch,
          micr_code: verifiedPayload.micr?.toString?.() || null,
          name_match_score: verifiedPayload.name_match_score,
          name_match_result: verifiedPayload.name_match_result,
          account_status: verifiedPayload.account_status,
          account_status_code: verifiedPayload.account_status_code,
          ifsc_details: verifiedPayload.ifsc_details,
          last_verified_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error(
          "Error inserting bank details after verification:",
          insertError
        );
        return NextResponse.json(
          { error: "Failed to save bank details" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        bankDetails,
        verificationInitiated: true,
        verificationStatus: "valid",
      });
    } catch (verificationError) {
      console.error("Error during bank verification:", verificationError);
      const details =
        verificationError instanceof Error
          ? verificationError.message
          : String(verificationError);

      // Attempt to parse Cashfree error payload and status from message
      let statusFromProvider: number | null = null;
      let cfPayload: any = null;
      const statusMatch = details.match(/Cashfree API error:\s*(\d+)/i);
      if (statusMatch && statusMatch[1]) {
        statusFromProvider = parseInt(statusMatch[1], 10);
      }
      const jsonStart = details.indexOf("{");
      if (jsonStart !== -1) {
        try {
          cfPayload = JSON.parse(details.slice(jsonStart));
        } catch (_) {}
      }

      // Map common validation errors to 400 for better UX
      const providerCode = cfPayload?.code || "";
      const providerMsg = cfPayload?.message || "";
      const looksLikeInvalidIfsc =
        /invalid\s*ifsc/i.test(providerCode) ||
        /invalid\s*ifsc/i.test(providerMsg);
      const looksLikeUserIdIssues =
        providerCode === "user_id_length_exceeded" ||
        providerCode === "user_id_already_exists";

      if (
        looksLikeInvalidIfsc ||
        looksLikeUserIdIssues ||
        statusFromProvider === 400
      ) {
        return NextResponse.json(
          {
            error: looksLikeInvalidIfsc
              ? "Invalid IFSC code"
              : "Verification request invalid",
            details: details,
            code: providerCode || undefined,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to initiate bank verification", details },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/supplier/bank-details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
