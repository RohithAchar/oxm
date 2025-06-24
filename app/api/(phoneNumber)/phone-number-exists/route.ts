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
      return NextResponse.json({
        exists: false,
      });
    }

    // Check if the user has a phone number in the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("phone_number")
      .eq("id", user.id)
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
