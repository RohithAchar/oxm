"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  avatar: z.any().optional(),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

interface ProfileEditFormProps {
  user: User;
}

export const ProfileEditForm = ({ user }: ProfileEditFormProps) => {
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(
    user.user_metadata.avatar_url || null
  );
  const [phone, setPhone] = useState<string>("");
  const [updatingPhone, setUpdatingPhone] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: user.user_metadata.full_name || "",
    },
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("full_name", data.full_name);

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      router.push("/account");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePhone = async () => {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(phone)) {
      toast.error("Enter a valid 10-digit Indian number");
      return;
    }
    try {
      setUpdatingPhone(true);
      const res = await fetch("/api/phone-number-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to update phone number");
      }
      toast.success("Phone number updated successfully");
    } catch (e: any) {
      toast.error(e?.message || "Could not update phone number");
    } finally {
      setUpdatingPhone(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={profilePic || "/placeholder-profile.png"}
                          alt="Profile Picture"
                        />
                        <AvatarFallback>
                          {user.user_metadata.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/jpeg, image/png, image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setProfilePic(URL.createObjectURL(file));
                            } else {
                              onChange(undefined);
                              setProfilePic(
                                user.user_metadata.avatar_url || null
                              );
                            }
                          }}
                          {...fieldProps}
                          disabled={loading}
                        />
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG or WEBP. Max size 2MB.
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={user.user_metadata.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed. Contact support if you need to update
                your email.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="flex gap-2">
                <div className="px-3 h-10 rounded-md border bg-muted/40 text-foreground grid place-items-center text-sm font-medium">
                  +91
                </div>
                <Input
                  inputMode="numeric"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const digits = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setPhone(digits);
                  }}
                  disabled={loading || updatingPhone}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={updatePhone}
                  disabled={updatingPhone || phone.length !== 10}
                >
                  {updatingPhone ? "Updating..." : "Update Phone"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter your Indian mobile number. It will be updated without verification.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/account")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
