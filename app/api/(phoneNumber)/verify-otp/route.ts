// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@/utils/supabase/server";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json();
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not authenticated",
        },
        { status: 401 }
      );
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    if (verificationCheck.status === "approved") {
      // Update the specific user's profile with WHERE clause
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          phone_number: phoneNumber,
        })
        .eq("id", user.id); // Add WHERE clause to specify which user

      if (updateError) {
        console.error("Database update error:", updateError);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to update phone number in database",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: verificationCheck.status === "approved",
      status: verificationCheck.status,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify OTP",
      },
      { status: 500 }
    );
  }
}
