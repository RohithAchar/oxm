// app/api/send-otp/route.ts

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    return NextResponse.json({
      success: true,
      status: verification.status,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}
