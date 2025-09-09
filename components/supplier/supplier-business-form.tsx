"use client";

import z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarImage } from "../ui/avatar";

import { createBusinessformSchema } from "@/app/(business)/create-business/types";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createBusiness } from "@/lib/controller/business/businessOperations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const businessType = [
  "MANUFACTURER",
  "WHOLESALER",
  "DISTRIBUTOR",
  "TRADER / RESELLER",
  "DROPSHIPPER",
  "EXPORTER",
  "IMPORTER",
  "OTHER",
] as const;

const SupplierBusinessForm = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const [mainPhone, setMainPhone] = useState("");
  const [mainOtpSent, setMainOtpSent] = useState(false);
  const [mainOtp, setMainOtp] = useState("");
  const [mainVerified, setMainVerified] = useState(false);
  const [altPhone, setAltPhone] = useState("");
  const [altOtpSent, setAltOtpSent] = useState(false);
  const [altOtp, setAltOtp] = useState("");
  const [altVerified, setAltVerified] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [gstCertificate, setGstCertificate] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof createBusinessformSchema>>({
    resolver: zodResolver(createBusinessformSchema),
    defaultValues: {
      businessName: "",
      main_phone: "",
      alternative_phone: "",
      gstNumber: "",
      city: "",
      state: "",
      pincode: "",
      businessAddress: "",
      profile_pic: undefined,
      gst_certificate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof createBusinessformSchema>) {
    try {
      setLoading(true);
      await createBusiness(userId, values);
      toast.success("Business created successfully!");
      resetForm();
      router.push("/supplier/profile");
    } catch (error) {
      toast.error("Failed to create business. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setProfilePic(null);
    setGstCertificate(null);
    form.reset();
    setMainPhone("");
    setMainOtp("");
    setMainOtpSent(false);
    setMainVerified(false);
    setAltPhone("");
    setAltOtp("");
    setAltOtpSent(false);
    setAltVerified(false);
  }

  return (
    <Card className="md:rounded-l-none">
      <CardHeader>
        <CardTitle>Create Business</CardTitle>
        <CardDescription>
          Create your business profile and start selling products.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="profile_pic"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Business Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                        <AvatarImage
                          src={profilePic || "/placeholder-profile.png"}
                          alt="Profile Picture"
                          className="h-full w-full object-cover"
                        />
                      </Avatar>

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
                            setProfilePic(null);
                          }
                        }}
                        {...fieldProps}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="e.g., Acme Trading Co."
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your registered business name as it appears on
                    official documents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full bg-primary-foreground">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Type</SelectLabel>
                          {businessType.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    What type of business is this?
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="main_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="9876543210"
                          value={mainPhone}
                          onChange={(e) => {
                            const value = e.target.value;
                            setMainPhone(value);
                            setMainVerified(false);
                            setMainOtpSent(false);
                            setMainOtp("");
                            field.onChange(value);
                          }}
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={loading || mainPhone.length !== 10 || mainVerified}
                          onClick={async () => {
                            try {
                              setLoading(true);
                              const res = await fetch("/api/otp/send", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ phone: mainPhone, purpose: "main" }),
                              });
                              const data = await res.json();
                              if (!res.ok || !data?.success) {
                                throw new Error(data?.message || "Failed to send OTP");
                              }
                              setMainOtpSent(true);
                              toast.success("OTP sent to main number");
                            } catch (err: any) {
                              toast.error(err?.message || "Failed to send OTP");
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          {mainVerified ? "Verified" : mainOtpSent ? "Resend OTP" : "Send OTP"}
                        </Button>
                      </div>
                      {mainOtpSent && !mainVerified && (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={mainOtp}
                            onChange={(e) => setMainOtp(e.target.value)}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            disabled={loading || mainOtp.length !== 6}
                            onClick={async () => {
                              try {
                                setLoading(true);
                                const res = await fetch("/api/otp/verify", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ phone: mainPhone, code: mainOtp, purpose: "main" }),
                                });
                                const data = await res.json();
                                if (!res.ok || !data?.success) {
                                  throw new Error(data?.message || "Invalid or expired OTP");
                                }
                                setMainVerified(true);
                                toast.success("Main phone verified");
                              } catch (err: any) {
                                toast.error(err?.message || "Failed to verify OTP");
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            Verify
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Provide your main business contact number. It will be saved only after OTP verification.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternative_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="9876543210"
                          value={altPhone}
                          onChange={(e) => {
                            const value = e.target.value;
                            setAltPhone(value);
                            setAltVerified(false);
                            setAltOtpSent(false);
                            setAltOtp("");
                            field.onChange(value);
                          }}
                          disabled={loading}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={loading || altPhone.length !== 10 || altVerified}
                          onClick={async () => {
                            try {
                              setLoading(true);
                              const res = await fetch("/api/otp/send", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ phone: altPhone, purpose: "alternate" }),
                              });
                              const data = await res.json();
                              if (!res.ok || !data?.success) {
                                throw new Error(data?.message || "Failed to send OTP");
                              }
                              setAltOtpSent(true);
                              toast.success("OTP sent to alternate number");
                            } catch (err: any) {
                              toast.error(err?.message || "Failed to send OTP");
                            } finally {
                              setLoading(false);
                            }
                          }}
                        >
                          {altVerified ? "Verified" : altOtpSent ? "Resend OTP" : "Send OTP"}
                        </Button>
                      </div>
                      {altOtpSent && !altVerified && (
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Enter 6-digit OTP"
                            value={altOtp}
                            onChange={(e) => setAltOtp(e.target.value)}
                            disabled={loading}
                          />
                          <Button
                            type="button"
                            disabled={loading || altOtp.length !== 6}
                            onClick={async () => {
                              try {
                                setLoading(true);
                                const res = await fetch("/api/otp/verify", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ phone: altPhone, code: altOtp, purpose: "alternate" }),
                                });
                                const data = await res.json();
                                if (!res.ok || !data?.success) {
                                  throw new Error(data?.message || "Invalid or expired OTP");
                                }
                                setAltVerified(true);
                                toast.success("Alternate phone verified");
                              } catch (err: any) {
                                toast.error(err?.message || "Failed to verify OTP");
                              } finally {
                                setLoading(false);
                              }
                            }}
                          >
                            Verify
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Provide an alternative contact number. It will be saved only after OTP verification.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="22AAAAA0000A1Z5"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your 15-digit GST registration number issued by the
                      tax authorities.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gst_certificate"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>GST Certificate</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setGstCertificate(file.name);
                            }
                          }}
                          disabled={loading}
                          {...field}
                        />
                        {gstCertificate && (
                          <p className="text-sm text-green-600">
                            Selected: {gstCertificate}
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your GST certificate (PDF, JPEG, PNG, or WEBP format, max 5MB).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Mumbai"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the city where your business is located.
                  </FormDescription>
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
                    <Input
                      type="text"
                      placeholder="Maharashtra"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the state or union territory of your business
                    location.
                  </FormDescription>
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
                    <Input
                      type="number"
                      placeholder="400001"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide the 6-digit postal code for your business address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Plot No. 123, Sector 45, Business District"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the complete street address of your business premises.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="reset"
                onClick={resetForm}
                variant={"destructive"}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  // Main phone is required and must be verified
                  !mainVerified ||
                  // If alt phone provided, require verified before submit
                  (altPhone.trim().length > 0 && !altVerified)
                }
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Business
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SupplierBusinessForm;
