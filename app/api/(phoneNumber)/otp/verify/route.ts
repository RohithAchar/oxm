import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const phone: string | undefined = body?.phone;
    const code: string | undefined = body?.code;
    const purpose: string | undefined = body?.purpose; // e.g., "alternate" | undefined (primary)

    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !indianPhoneRegex.test(phone) || !code || code.length !== 6) {
      return NextResponse.json(
        { success: false, message: "Invalid payload" },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !verifyServiceSid) {
      return NextResponse.json(
        { success: false, message: "Twilio not configured" },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);
    const e164Phone = `+91${phone}`;

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: e164Phone, code });

    if (verificationCheck.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Invalid or expired code" },
        { status: 400 }
      );
    }

    if (purpose === "alternate") {
      // For alternate flow, just confirm verification success.
      // The frontend will allow submission, and the value will be saved during business creation.
      return NextResponse.json({ success: true, verified: true });
    } else {
      // Primary flow: mark phone verified on the profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_phone_verified: true })
        .eq("id", user.id as any);

      if (updateError) {
        return NextResponse.json(
          { success: false, message: updateError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}


