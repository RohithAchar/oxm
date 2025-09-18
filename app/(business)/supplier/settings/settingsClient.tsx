"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateBusiness } from "@/lib/controller/business/businessOperations";
import {
  BusinessProfileUpdateSchema,
  UpdateProfileFormData,
  businessType,
} from "../profile/[id]/edit/types";

type Business = NonNullable<
  Awaited<
    ReturnType<
      typeof import("@/lib/controller/business/businessOperations").getBusiness
    >
  >
>;

export default function SettingsClient({ business }: { business: Business }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(BusinessProfileUpdateSchema),
    defaultValues: {
      business_name: business.business_name,
      business_address: business.business_address,
      city: business.city,
      state: business.state,
      pincode: business.pincode,
      type: business.type || "OTHER",
      main_phone: business.phone?.toString() || "",
      alternate_phone: business.alternate_phone || "",
    },
  });

  async function sendOtp(phone: string, purpose?: "alternate" | "update") {
    const res = await fetch("/api/(phoneNumber)/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, purpose }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed");
  }

  async function verifyOtp(
    phone: string,
    code: string,
    purpose?: "alternate" | "update"
  ) {
    const res = await fetch("/api/(phoneNumber)/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code, purpose }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || "Failed");
  }

  return (
    <Card>
      <CardContent className="p-3 md:p-6">
        <div className="flex items-center gap-4 pb-4">
          <Avatar className="size-16">
            <AvatarImage
              src={business.profile_avatar_url || undefined}
              alt={business.business_name || "Business"}
            />
            <AvatarFallback>
              {business.business_name?.slice(0, 2)?.toUpperCase() || "BZ"}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  form.setValue("profile_pic", file as any, {
                    shouldDirty: true,
                  });
                }
              }}
              className="max-w-xs"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => form.setValue("profile_pic", undefined as any)}
            >
              Remove
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (data) => {
              try {
                setIsSubmitting(true);
                await updateBusiness(
                  business.id,
                  data,
                  business.profile_avatar_url || ""
                );
                toast.success("Business profile updated");
              } catch (e) {
                toast.error("Failed to update profile");
              } finally {
                setIsSubmitting(false);
              }
            })}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Types</SelectLabel>
                          {businessType.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="main_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main phone</FormLabel>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input inputMode="numeric" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const phone = (form.getValues("main_phone") || "")
                              .replace(/\D/g, "")
                              .slice(-10);
                            if (!phone) return toast.error("Enter phone first");
                            await sendOtp(phone);
                            const code =
                              window.prompt("Enter OTP sent to +91" + phone) ||
                              "";
                            if (!code) return;
                            await verifyOtp(phone, code);
                            toast.success("Phone verified");
                          } catch (e: any) {
                            toast.error(e.message || "Verification failed");
                          }
                        }}
                      >
                        Verify
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alternate_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate phone</FormLabel>
                    <div className="flex gap-2 items-center">
                      <FormControl>
                        <Input inputMode="numeric" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const phone = (
                              form.getValues("alternate_phone") || ""
                            )
                              .replace(/\D/g, "")
                              .slice(-10);
                            if (!phone)
                              return toast.error("Enter alternate phone first");
                            await sendOtp(phone, "alternate");
                            const code =
                              window.prompt("Enter OTP sent to +91" + phone) ||
                              "";
                            if (!code) return;
                            await verifyOtp(phone, code, "alternate");
                            toast.success("Alternate phone verified");
                          } catch (e: any) {
                            toast.error(e.message || "Verification failed");
                          }
                        }}
                      >
                        Verify
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="business_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
