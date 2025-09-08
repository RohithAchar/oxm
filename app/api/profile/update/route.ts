import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const full_name = formData.get("full_name") as string;
    const business_type = formData.get("business_type") as string;
    const avatarFile = formData.get("avatar") as File | null;

    if (!full_name) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    let avatar_url = user.user_metadata.avatar_url;

    // Handle avatar upload if provided
    if (avatarFile && avatarFile.size > 0) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          {
            error:
              "Invalid file type. Only JPEG, PNG, and WEBP files are allowed",
          },
          { status: 400 }
        );
      }

      // Validate file size (2MB limit)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (avatarFile.size > maxSize) {
        return NextResponse.json(
          { error: "File size too large. Maximum size is 2MB" },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileExtension = avatarFile.name.split(".").pop();
      const fileName = `user-avatar-${user.id}-${timestamp}-${randomString}.${fileExtension}`;

      // Convert file to buffer
      const fileBuffer = await avatarFile.arrayBuffer();
      const buffer = new Uint8Array(fileBuffer);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("user-profile-avatars")
        .upload(fileName, buffer, {
          contentType: avatarFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload avatar" },
          { status: 500 }
        );
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("user-profile-avatars")
        .getPublicUrl(fileName);

      avatar_url = urlData.publicUrl;
    }

    // Update user metadata
    const updateData: any = {
      full_name,
      avatar_url,
    };

    if (business_type) {
      updateData.business_type = business_type;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: updateData,
    });

    if (updateError) {
      console.error("User update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update user profile" },
        { status: 500 }
      );
    }

    // Also update the profiles table
    const profileUpdateData: any = {
      full_name,
      avatar_url,
      updated_at: new Date().toISOString(),
    };

    if (business_type) {
      profileUpdateData.business_type = business_type;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdateData)
      .eq("id", user.id);

    if (profileError) {
      console.error("Profile update error:", profileError);
      // Don't fail the request if profiles table update fails
      // The auth metadata update is more important
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
