import { NextRequest, NextResponse } from "next/server";

// IFSC Code validation and bank details lookup
// This uses a free IFSC API service for bank details lookup

interface IFSCResponse {
  bank: string;
  branch: string;
  address: string;
  city: string;
  district: string;
  state: string;
  contact?: string;
  rtgs: boolean;
  neft: boolean;
  imps: boolean;
  upi: boolean;
}

interface BankDetails {
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  branch_address: string;
  city: string;
  state: string;
  district: string;
  supports_rtgs: boolean;
  supports_neft: boolean;
  supports_imps: boolean;
  supports_upi: boolean;
  is_valid: boolean;
}

// Cache for IFSC lookups (in production, use Redis)
const ifscCache = new Map<string, { data: BankDetails; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Mock bank data for development/testing
const mockBankData: Record<string, BankDetails> = {
  HDFC0001234: {
    ifsc_code: "HDFC0001234",
    bank_name: "HDFC Bank",
    branch_name: "Koramangala Branch",
    branch_address: "123 Koramangala, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    district: "Bangalore Urban",
    supports_rtgs: true,
    supports_neft: true,
    supports_imps: true,
    supports_upi: true,
    is_valid: true,
  },
  ICIC0001234: {
    ifsc_code: "ICIC0001234",
    bank_name: "ICICI Bank",
    branch_name: "Indiranagar Branch",
    branch_address: "456 Indiranagar, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    district: "Bangalore Urban",
    supports_rtgs: true,
    supports_neft: true,
    supports_imps: true,
    supports_upi: true,
    is_valid: true,
  },
  SBIN0001234: {
    ifsc_code: "SBIN0001234",
    bank_name: "State Bank of India",
    branch_name: "MG Road Branch",
    branch_address: "789 MG Road, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    district: "Bangalore Urban",
    supports_rtgs: true,
    supports_neft: true,
    supports_imps: true,
    supports_upi: true,
    is_valid: true,
  },
};

function validateIFSCFormat(ifsc: string): boolean {
  // IFSC format: 4 letters + 0 + 6 alphanumeric characters
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
}

async function fetchIFSCDetails(ifscCode: string): Promise<BankDetails | null> {
  // Check cache first
  const cached = ifscCache.get(ifscCode);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Check mock data first (for development)
  if (mockBankData[ifscCode]) {
    const mockData = mockBankData[ifscCode];
    ifscCache.set(ifscCode, { data: mockData, timestamp: Date.now() });
    return mockData;
  }

  try {
    // Try multiple free IFSC APIs
    const apis = [
      `https://ifsc.razorpay.com/${ifscCode}`,
      `https://bank-apis.justinclicks.com/API/V1/IFSC/${ifscCode}/`,
    ];

    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "User-Agent": "OpenXmart-IFSC-Lookup/1.0",
          },
          // Add timeout
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (response.ok) {
          const data: IFSCResponse = await response.json();

          const bankDetails: BankDetails = {
            ifsc_code: ifscCode,
            bank_name: data.bank || "Unknown Bank",
            branch_name: data.branch || "Unknown Branch",
            branch_address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            district: data.district || "",
            supports_rtgs: data.rtgs || false,
            supports_neft: data.neft || false,
            supports_imps: data.imps || false,
            supports_upi: data.upi || false,
            is_valid: true,
          };

          // Cache the result
          ifscCache.set(ifscCode, { data: bankDetails, timestamp: Date.now() });
          return bankDetails;
        }
      } catch (apiError) {
        console.warn(`IFSC API ${apiUrl} failed:`, apiError);
        continue; // Try next API
      }
    }

    // If all APIs fail, return null
    return null;
  } catch (error) {
    console.error("Error fetching IFSC details:", error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const ifscCode = code.toUpperCase().trim();

    // Validate IFSC format
    if (!validateIFSCFormat(ifscCode)) {
      return NextResponse.json(
        {
          error: "Invalid IFSC code format",
          message:
            "IFSC code should be 11 characters: 4 letters + 0 + 6 alphanumeric characters",
          example: "HDFC0001234",
        },
        { status: 400 }
      );
    }

    // Fetch bank details
    const bankDetails = await fetchIFSCDetails(ifscCode);

    if (!bankDetails) {
      return NextResponse.json(
        {
          error: "IFSC code not found",
          message:
            "The provided IFSC code is not valid or not found in our database",
          is_valid: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bankDetails,
    });
  } catch (error) {
    console.error("Unexpected error in IFSC lookup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST method for batch IFSC lookup (optional)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ifsc_codes } = body;

    if (!Array.isArray(ifsc_codes) || ifsc_codes.length === 0) {
      return NextResponse.json(
        { error: "Invalid request. Provide an array of IFSC codes." },
        { status: 400 }
      );
    }

    if (ifsc_codes.length > 10) {
      return NextResponse.json(
        { error: "Too many IFSC codes. Maximum 10 allowed per request." },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      ifsc_codes.map(async (code: string) => {
        const ifscCode = code.toUpperCase().trim();

        if (!validateIFSCFormat(ifscCode)) {
          return {
            ifsc_code: ifscCode,
            error: "Invalid IFSC format",
            is_valid: false,
          };
        }

        const bankDetails = await fetchIFSCDetails(ifscCode);
        return (
          bankDetails || {
            ifsc_code: ifscCode,
            error: "IFSC code not found",
            is_valid: false,
          }
        );
      })
    );

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Unexpected error in batch IFSC lookup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
