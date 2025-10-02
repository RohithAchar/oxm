// Real Cashfree Integration Service
// Bank Account Verification via Penny Drop

const CASHFREE_BASE_URL =
  process.env.CASHFREE_BASE_URL || "https://payout-gamma.cashfree.com";
const CASHFREE_CLIENT_ID = process.env.CASHFREE_CLIENT_ID;
const CASHFREE_CLIENT_SECRET = process.env.CASHFREE_CLIENT_SECRET;

// Get Cashfree Access Token
async function getCashfreeToken(): Promise<string> {
  if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
    throw new Error("Cashfree credentials not configured");
  }

  try {
    const response = await fetch(`${CASHFREE_BASE_URL}/payout/v1/authorize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: CASHFREE_CLIENT_ID,
        clientSecret: CASHFREE_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "SUCCESS" || !data.data?.token) {
      throw new Error("Failed to get access token");
    }

    return data.data.token;
  } catch (error) {
    console.error("Error getting Cashfree token:", error);
    throw error;
  }
}

// Bank Account Verification via Penny Drop
export async function verifyBankAccount(bankDetails: {
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
}) {
  try {
    console.log("🏦 Initiating real Cashfree penny drop verification:", {
      account_number: bankDetails.account_number.slice(-4),
      ifsc_code: bankDetails.ifsc_code,
      account_holder_name: bankDetails.account_holder_name,
    });

    // Check if we have credentials
    if (!CASHFREE_CLIENT_ID || !CASHFREE_CLIENT_SECRET) {
      console.warn("Cashfree credentials not found, using mock response");
      return await simulatePennyDropAPI(bankDetails);
    }

    // Get access token
    const token = await getCashfreeToken();

    // Make penny drop verification request
    const verificationId = `PD_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const response = await fetch(
      `${CASHFREE_BASE_URL}/payout/v1/validation/bankDetails`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bankAccount: bankDetails.account_number,
          ifsc: bankDetails.ifsc_code,
          name: bankDetails.account_holder_name,
          phone: "9999999999", // Optional - you can get this from user profile
          transferId: verificationId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cashfree API error:", errorData);

      return {
        success: false,
        message: errorData.message || "Bank verification failed",
        details: {
          error_code: errorData.subCode || "API_ERROR",
          error_message: errorData.message || "Unknown error",
          reference_id: verificationId,
        },
      };
    }

    const result = await response.json();
    console.log("Cashfree verification result:", result);

    // Parse Cashfree response
    if (result.status === "SUCCESS" && result.data) {
      const verificationData = result.data;

      return {
        success: verificationData.bankAccountExists === "YES",
        message:
          verificationData.bankAccountExists === "YES"
            ? "Bank account verified successfully"
            : "Bank account verification failed",
        details: {
          reference_id: verificationId,
          account_exists: verificationData.bankAccountExists === "YES",
          name_match: verificationData.nameAtBank
            ? verificationData.nameAtBank
                .toLowerCase()
                .includes(bankDetails.account_holder_name.toLowerCase())
            : false,
          bank_response: verificationData.message || "Verification completed",
          name_at_bank: verificationData.nameAtBank,
          utr: verificationData.utr,
        },
      };
    } else {
      return {
        success: false,
        message: result.message || "Verification failed",
        details: {
          reference_id: verificationId,
          error_code: result.subCode || "VERIFICATION_FAILED",
          error_message: result.message || "Unknown error",
        },
      };
    }
  } catch (error) {
    console.error("Cashfree penny drop verification error:", error);

    // Fallback to mock if API fails
    if (
      error instanceof Error &&
      error.message.includes("credentials not configured")
    ) {
      console.warn("Using mock verification due to missing credentials");
      return await simulatePennyDropAPI(bankDetails);
    }

    return {
      success: false,
      message: "Verification service temporarily unavailable",
      details: {
        error: error instanceof Error ? error.message : "Service error",
        reference_id: `PD_ERROR_${Date.now()}`,
      },
    };
  }
}

// Simulate Cashfree Penny Drop API using official test data
async function simulatePennyDropAPI(bankDetails: any) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const { account_number, ifsc_code, account_holder_name } = bankDetails;

  // Official Cashfree test data patterns from:
  // https://www.cashfree.com/docs/payouts/payouts/integrations/data-to-test

  // Success cases
  const successCases = [
    { account: "026291800001191", ifsc: "YESB0000262" },
    { account: "00011020001772", ifsc: "HDFC0000001" },
    { account: "1233943142", ifsc: "ICIC0000009" },
    { account: "388108022658", ifsc: "ICIC0000009" },
    { account: "000890289871772", ifsc: "SCBL0036078" },
    { account: "000100289877623", ifsc: "SBIN0008752" },
  ];

  // Failure cases
  const failureCases = [
    {
      account: "026291800001190",
      ifsc: "YESB0000262",
      reason: "Invalid Account number",
    },
    {
      account: "234005000876",
      ifsc: "ICIC0000007",
      reason: "Invalid Account number",
    },
    { account: "1234567890", ifsc: "ICIC0000001", reason: "Invalid IFSC code" },
    {
      account: "2640101002729",
      ifsc: "CNRR0002640",
      reason: "Invalid IFSC code",
    },
  ];

  // Pending cases
  const pendingCases = [
    { account: "007711000031", ifsc: "HDFC0000077" },
    { account: "00224412311300", ifsc: "YESB0000001" },
  ];

  // Check for success cases
  const isSuccess = successCases.some(
    (testCase) =>
      testCase.account === account_number && testCase.ifsc === ifsc_code
  );

  if (isSuccess) {
    return {
      success: true,
      message: "Account verified successfully",
      reference_id: `PD_SUCCESS_${Date.now()}`,
      account_exists: true,
      name_match: true,
      bank_response: "Account holder name matches",
    };
  }

  // Check for failure cases
  const failureCase = failureCases.find(
    (testCase) =>
      testCase.account === account_number && testCase.ifsc === ifsc_code
  );

  if (failureCase) {
    return {
      success: false,
      message: "Account verification failed",
      reference_id: `PD_FAIL_${Date.now()}`,
      account_exists: false,
      name_match: false,
      bank_response: failureCase.reason,
    };
  }

  // Check for pending cases
  const isPending = pendingCases.some(
    (testCase) =>
      testCase.account === account_number && testCase.ifsc === ifsc_code
  );

  if (isPending) {
    return {
      success: false, // Will be updated to success later
      message: "Verification is pending",
      reference_id: `PD_PENDING_${Date.now()}`,
      account_exists: true,
      name_match: false,
      bank_response: "Verification in progress, please check back later",
    };
  }

  // Default case for other account numbers - simulate realistic validation
  const isValidIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc_code);
  const isValidAccountNumber =
    account_number.length >= 9 && account_number.length <= 18;

  if (!isValidIFSC || !isValidAccountNumber) {
    return {
      success: false,
      message: "Invalid account details",
      reference_id: `PD_INVALID_${Date.now()}`,
      account_exists: false,
      name_match: false,
      bank_response: !isValidIFSC
        ? "Invalid IFSC code format"
        : "Invalid account number format",
    };
  }

  // For other valid formats, simulate 80% success rate
  const shouldSucceed = Math.random() > 0.2;

  return {
    success: shouldSucceed,
    message: shouldSucceed
      ? "Account verified successfully"
      : "Account verification failed",
    reference_id: `PD_${shouldSucceed ? "SUCCESS" : "FAIL"}_${Date.now()}`,
    account_exists: shouldSucceed,
    name_match: shouldSucceed,
    bank_response: shouldSucceed
      ? "Account holder name matches"
      : "Account not found or name mismatch",
  };
}

interface CashfreeBeneficiaryRequest {
  beneId: string;
  name: string;
  email: string;
  phone: string;
  bankAccount: string;
  ifsc: string;
  address1: string;
  city: string;
  state: string;
  pincode: string;
}

interface CashfreeBeneficiaryResponse {
  success: boolean;
  beneficiary_id: string;
  status: "VERIFIED" | "PENDING" | "FAILED";
  message: string;
  data?: any;
}

interface CashfreePayoutRequest {
  beneId: string;
  amount: number;
  transferId: string;
  transferMode: "banktransfer";
  remarks: string;
}

interface CashfreePayoutResponse {
  success: boolean;
  transferId: string;
  status: "SUCCESS" | "PENDING" | "FAILED";
  message: string;
  data?: any;
}

interface CashfreeOrderRequest {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_phone: string;
    customer_email: string;
  };
  order_meta: {
    payment_methods: string;
    return_url: string;
    notify_url: string;
  };
}

interface CashfreeOrderResponse {
  success: boolean;
  payment_session_id: string;
  order_id: string;
  data?: any;
}

class MockCashfreeService {
  private isProduction: boolean;
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.isProduction = process.env.CASHFREE_ENVIRONMENT === "production";
    this.clientId = process.env.CASHFREE_CLIENT_ID || "mock_client_id";
    this.clientSecret =
      process.env.CASHFREE_CLIENT_SECRET || "mock_client_secret";
    this.baseUrl = this.isProduction
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";
  }

  // Mock delay to simulate API response time
  private async mockDelay(ms: number = 1000): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Generate mock beneficiary ID
  private generateBeneficiaryId(beneId: string): string {
    return `CF_BENE_${beneId}_${Date.now()}`;
  }

  // Generate mock transfer ID
  private generateTransferId(): string {
    return `CF_TRANSFER_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  // Create Beneficiary (Mock Implementation)
  async createBeneficiary(
    request: CashfreeBeneficiaryRequest
  ): Promise<CashfreeBeneficiaryResponse> {
    console.log("🏦 Mock Cashfree: Creating beneficiary", {
      beneId: request.beneId,
    });

    // Simulate API delay
    await this.mockDelay(1500);

    // Mock validation - simulate some failures for testing
    const shouldFail = Math.random() < 0.1; // 10% failure rate for testing

    if (shouldFail) {
      return {
        success: false,
        beneficiary_id: "",
        status: "FAILED",
        message:
          "Bank account verification failed. Please check account details.",
      };
    }

    // Mock success response
    const beneficiaryId = this.generateBeneficiaryId(request.beneId);

    return {
      success: true,
      beneficiary_id: beneficiaryId,
      status: "VERIFIED",
      message: "Bank account verified successfully",
      data: {
        beneId: request.beneId,
        name: request.name,
        bankAccount: request.bankAccount,
        ifsc: request.ifsc,
        status: "ACTIVE",
        verifiedAt: new Date().toISOString(),
      },
    };
  }

  // Get Beneficiary Status (Mock Implementation)
  async getBeneficiaryStatus(
    beneficiaryId: string
  ): Promise<CashfreeBeneficiaryResponse> {
    console.log("🏦 Mock Cashfree: Getting beneficiary status", {
      beneficiaryId,
    });

    await this.mockDelay(500);

    return {
      success: true,
      beneficiary_id: beneficiaryId,
      status: "VERIFIED",
      message: "Beneficiary is active and verified",
      data: {
        status: "ACTIVE",
        verifiedAt: new Date().toISOString(),
      },
    };
  }

  // Request Payout (Mock Implementation)
  async requestPayout(
    request: CashfreePayoutRequest
  ): Promise<CashfreePayoutResponse> {
    console.log("💰 Mock Cashfree: Requesting payout", {
      beneId: request.beneId,
      amount: request.amount,
      transferId: request.transferId,
    });

    await this.mockDelay(2000);

    // Mock validation - simulate some failures
    const shouldFail = Math.random() < 0.05; // 5% failure rate

    if (shouldFail) {
      return {
        success: false,
        transferId: request.transferId,
        status: "FAILED",
        message: "Payout failed due to insufficient balance or technical error",
      };
    }

    return {
      success: true,
      transferId: request.transferId,
      status: "SUCCESS",
      message: "Payout processed successfully",
      data: {
        amount: request.amount,
        beneId: request.beneId,
        processedAt: new Date().toISOString(),
        utr: `UTR${Date.now()}`, // Mock UTR number
        charges: request.amount * 0.01, // Mock 1% charges
      },
    };
  }

  // Create Payment Order (Mock Implementation)
  async createOrder(
    request: CashfreeOrderRequest
  ): Promise<CashfreeOrderResponse> {
    console.log("💳 Mock Cashfree: Creating payment order", {
      order_id: request.order_id,
      amount: request.order_amount,
    });

    await this.mockDelay(800);

    const paymentSessionId = `CF_SESSION_${request.order_id}_${Date.now()}`;

    return {
      success: true,
      payment_session_id: paymentSessionId,
      order_id: request.order_id,
      data: {
        order_amount: request.order_amount,
        order_currency: request.order_currency,
        payment_methods: request.order_meta.payment_methods,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      },
    };
  }

  // Verify Payment (Mock Implementation)
  async verifyPayment(orderId: string): Promise<any> {
    console.log("✅ Mock Cashfree: Verifying payment", { orderId });

    await this.mockDelay(500);

    return {
      success: true,
      order_id: orderId,
      payment_status: "SUCCESS",
      payment_amount: 299.0,
      payment_currency: "INR",
      payment_method: "UPI",
      payment_time: new Date().toISOString(),
      cf_payment_id: `CF_PAY_${Date.now()}`,
      bank_reference: `BANK_REF_${Date.now()}`,
    };
  }

  // Create Refund (Mock Implementation)
  async createRefund(
    paymentId: string,
    refundAmount: number,
    refundNote: string
  ): Promise<any> {
    console.log("🔄 Mock Cashfree: Creating refund", {
      paymentId,
      refundAmount,
      refundNote,
    });

    await this.mockDelay(1000);

    return {
      success: true,
      cf_payment_id: paymentId,
      cf_refund_id: `CF_REFUND_${Date.now()}`,
      refund_amount: refundAmount,
      refund_status: "SUCCESS",
      refund_note: refundNote,
      processed_at: new Date().toISOString(),
    };
  }

  // Get Account Balance (Mock Implementation)
  async getAccountBalance(): Promise<any> {
    console.log("💰 Mock Cashfree: Getting account balance");

    await this.mockDelay(300);

    return {
      success: true,
      balance: 50000.0, // Mock balance
      currency: "INR",
      last_updated: new Date().toISOString(),
    };
  }

  // Webhook signature verification (Mock Implementation)
  verifyWebhookSignature(
    payload: string,
    signature: string,
    timestamp: string
  ): boolean {
    console.log("🔐 Mock Cashfree: Verifying webhook signature");

    // In real implementation, this would verify the HMAC signature
    // For mock, we'll just return true
    return true;
  }
}

// Export singleton instance
export const cashfreeService = new MockCashfreeService();

// Export types for use in other files
export type {
  CashfreeBeneficiaryRequest,
  CashfreeBeneficiaryResponse,
  CashfreePayoutRequest,
  CashfreePayoutResponse,
  CashfreeOrderRequest,
  CashfreeOrderResponse,
};

// Utility functions
export const CashfreeUtils = {
  // Format amount for Cashfree (they expect amounts in paisa for some APIs)
  formatAmount: (amount: number): number => {
    return Math.round(amount * 100); // Convert to paisa
  },

  // Parse amount from Cashfree response
  parseAmount: (amount: number): number => {
    return amount / 100; // Convert from paisa to rupees
  },

  // Generate unique beneficiary ID
  generateBeneId: (supplierId: string): string => {
    return `SUPP_${supplierId}_${Date.now()}`;
  },

  // Generate unique transfer ID
  generateTransferId: (orderId: string): string => {
    return `PAYOUT_${orderId}_${Date.now()}`;
  },

  // Validate IFSC code format
  validateIFSC: (ifsc: string): boolean => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
  },

  // Validate account number format
  validateAccountNumber: (accountNumber: string): boolean => {
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(accountNumber);
  },
};
