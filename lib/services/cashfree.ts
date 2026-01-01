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

export interface CashfreeBeneficiaryInstrumentDetails {
  bank_account_number: string;
  bank_ifsc: string;
  vpa?: string | null;
}

export interface CashfreeBeneficiaryContactDetails {
  beneficiary_email?: string;
  beneficiary_phone?: string;
  beneficiary_country_code?: string;
  beneficiary_address?: string;
  beneficiary_city?: string;
  beneficiary_state?: string;
  beneficiary_postal_code?: string;
}

export interface CashfreeCreateBeneficiaryRequest {
  beneficiary_id: string;
  beneficiary_name: string;
  beneficiary_instrument_details: CashfreeBeneficiaryInstrumentDetails;
  beneficiary_contact_details: CashfreeBeneficiaryContactDetails;
}

export interface CashfreeCreateBeneficiaryResponse
  extends CashfreeCreateBeneficiaryRequest {
  beneficiary_status: string;
  added_on: string; // ISO timestamp
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

  private getPayoutHeaders() {
    return {
      "Content-Type": "application/json",
      "x-client-id": this.clientId,
      "x-client-secret": this.clientSecret,
      "x-api-version": "2024-01-01",
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

  /**
   * Create a payout beneficiary in Cashfree
   * This registers a supplier's bank account/VPA for receiving payouts
   */
  async createPayoutBeneficiary(
    payload: CashfreeCreateBeneficiaryRequest
  ): Promise<CashfreeCreateBeneficiaryResponse> {
    try {
      // Use payout API endpoint - check if baseUrl needs to be different for payout
      // Cashfree payout API is typically at payout-api.cashfree.com or payout-gamma.cashfree.com
      const payoutBaseUrl = this.baseUrl.includes("payout")
        ? this.baseUrl
        : this.baseUrl
            .replace("api.cashfree.com", "payout-api.cashfree.com")
            .replace("gamma.cashfree.com", "payout-gamma.cashfree.com");

      const response = await fetch(`${payoutBaseUrl}/payout/beneficiary`, {
        method: "POST",
        headers: this.getPayoutHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Cashfree Payout API error: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      return data as CashfreeCreateBeneficiaryResponse;
    } catch (error) {
      console.error("Error creating payout beneficiary:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to create payout beneficiary");
    }
  }
}

// Export singleton instance
export const cashfreeService = new CashfreeService();
