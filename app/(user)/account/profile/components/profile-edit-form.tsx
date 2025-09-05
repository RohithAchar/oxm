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
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [sendingOtp, setSendingOtp] = useState<boolean>(false);
  const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false);
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

  const sendOtp = async () => {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(phone)) {
      toast.error("Enter a valid 10-digit Indian number");
      return;
    }
    try {
      setSendingOtp(true);
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "update" }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to send OTP");
      }
      toast.success("OTP sent to +91 " + phone);
      setOtpSent(true);
    } catch (e: any) {
      toast.error(e?.message || "Could not send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    try {
      setVerifyingOtp(true);
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp, purpose: "update" }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.verified) {
        throw new Error(data?.message || "OTP verification failed");
      }
      toast.success("Phone number updated and verified");
      setOtp("");
      setOtpSent(false);
    } catch (e: any) {
      toast.error(e?.message || "Verification failed");
    } finally {
      setVerifyingOtp(false);
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
                    setOtpSent(false);
                    setOtp("");
                  }}
                  disabled={loading || sendingOtp || verifyingOtp}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={sendOtp}
                  disabled={sendingOtp || verifyingOtp || phone.length !== 10}
                >
                  {sendingOtp
                    ? "Sending..."
                    : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
                </Button>
              </div>
              {otpSent && (
                <div className="flex gap-2 pt-2">
                  <Input
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const digits = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtp(digits);
                    }}
                    disabled={verifyingOtp}
                  />
                  <Button
                    type="button"
                    onClick={verifyOtp}
                    disabled={verifyingOtp || otp.length !== 6}
                  >
                    {verifyingOtp ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Use your active Indian mobile number. We’ll verify it with an
                OTP.
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
