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
    const purpose: string | undefined = body?.purpose; // e.g., "alternate" | undefined (primary)

    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !indianPhoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Invalid Indian phone number" },
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

    await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: e164Phone, channel: "sms" });

    // For primary flow we historically persisted the phone on send.
    // For alternate flow, DO NOT persist anything on send.
    if (purpose !== "alternate") {
      await supabase
        .from("profiles")
        .update({ phone_number: Number(phone) })
        .eq("id", user.id as any);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}


