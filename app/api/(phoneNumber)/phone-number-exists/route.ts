// app/api/phone-number-exists/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      // If not authenticated, treat as if a phone number exists to avoid showing the popover
      return NextResponse.json({ exists: true });
    }

    // Check if the user has a phone number in the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("phone_number")
      .eq("id", user.id as any)
      .single();

    if (profileError || !profile || !profile.phone_number) {
      return NextResponse.json({
        exists: false,
      });
    }

    return NextResponse.json({
      exists: true,
    });
  } catch (error) {}
}

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

    // Accept only Indian mobile numbers: 10 digits starting with 6-9
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !indianPhoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Invalid Indian phone number" },
        { status: 400 }
      );
    }

    const phoneNumber = Number(phone);
    const { error: upsertError } = await supabase
      .from("profiles")
      .update({ phone_number: phoneNumber })
      .eq("id", user.id as any);

    if (upsertError) {
      return NextResponse.json(
        { success: false, message: upsertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}