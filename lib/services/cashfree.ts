// Mock Cashfree Integration Service
// This will be replaced with real Cashfree API integration once credentials are available

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
