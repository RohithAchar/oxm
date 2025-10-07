import { Database } from "@/utils/supabase/database.types";

type SupplierBankDetails =
  Database["public"]["Tables"]["supplier_bank_details"]["Row"];

export interface CashfreeBankVerificationRequest {
  bank_account: string;
  ifsc: string;
  name: string;
  user_id: string;
  phone: string;
}

export interface CashfreeBankVerificationResponse {
  reference_id: number;
  user_id: string;
  account_status: string;
  account_status_code: string;
}

export interface CashfreeBankVerificationStatus {
  reference_id: number;
  name_at_bank: string;
  bank_name: string;
  utr: string | null;
  city: string;
  branch: string;
  micr: number;
  name_match_score: number | null;
  name_match_result: string | null;
  account_status: string;
  account_status_code: string;
  ifsc_details: {
    bank: string;
    ifsc: string;
    micr: number;
    nbin: string | null;
    address: string;
    city: string;
    state: string;
    branch: string;
    ifsc_subcode: string;
    category: string | null;
    swift_code: string | null;
  };
}

export class CashfreeService {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.CASHFREE_CLIENT_ID!;
    this.clientSecret = process.env.CASHFREE_CLIENT_SECRET!;
    this.baseUrl = process.env.CASHFREE_BASE_URL!;

    if (!this.clientId || !this.clientSecret || !this.baseUrl) {
      throw new Error("Cashfree credentials not configured");
    }
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "x-client-id": this.clientId,
      "x-client-secret": this.clientSecret,
    };
  }

  /**
   * Initiate bank account verification
   */
  async verifyBankAccount(
    request: CashfreeBankVerificationRequest
  ): Promise<CashfreeBankVerificationResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/verification/bank-account/async`,
        {
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Cashfree API error: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error verifying bank account:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to initiate bank verification");
    }
  }

  /**
   * Check bank account verification status
   */
  async getBankVerificationStatus(
    referenceId: number,
    userId: string
  ): Promise<CashfreeBankVerificationStatus> {
    try {
      const response = await fetch(
        `${this.baseUrl}/verification/bank-account?reference_id=${referenceId}&user_id=${userId}`,
        {
          method: "GET",
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Cashfree API error: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting bank verification status:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to get bank verification status");
    }
  }

  /**
   * Map Cashfree verification status to our database status
   */
  mapVerificationStatus(accountStatus: string): string {
    switch (accountStatus) {
      case "VALID":
        return "valid";
      case "INVALID":
        return "invalid";
      case "RECEIVED":
        return "validating";
      default:
        return "failed";
    }
  }

  /**
   * Update supplier bank details with verification results
   */
  mapVerificationToBankDetails(
    bankDetails: SupplierBankDetails,
    verificationStatus: CashfreeBankVerificationStatus
  ): Partial<SupplierBankDetails> {
    return {
      verification_status: this.mapVerificationStatus(
        verificationStatus.account_status
      ),
      verification_message: verificationStatus.account_status_code,
      name_at_bank: verificationStatus.name_at_bank,
      bank_name: verificationStatus.bank_name,
      bank_city: verificationStatus.city,
      bank_branch: verificationStatus.branch,
      micr_code: verificationStatus.micr.toString(),
      name_match_score: verificationStatus.name_match_score,
      name_match_result: verificationStatus.name_match_result,
      account_status: verificationStatus.account_status,
      account_status_code: verificationStatus.account_status_code,
      ifsc_details: verificationStatus.ifsc_details,
      last_verified_at: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const cashfreeService = new CashfreeService();
