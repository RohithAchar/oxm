import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { phone_number, otp_code } = body;

    if (!phone_number || !otp_code) {
      return NextResponse.json(
        { error: "Phone number and OTP code are required" },
        { status: 400 }
      );
    }

    // Verify OTP with Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone_number,
      token: otp_code,
      type: "sms",
    });

    if (error) {
      console.error("OTP verification error:", error);
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "OTP verification failed" },
        { status: 400 }
      );
    }

    // Update user profile with verified phone number
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        phone_number: phone_number,
        phone_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      message: "Phone number verified successfully",
      user: data.user,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
