// components/supplier/supplier-business-form.tsx

"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { businessTypeOptions, formSchema } from "@/types/business";
import { useRouter } from "next/navigation";
import { Database } from "@/utils/supabase/database.types";

// Indian states for the dropdown
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Puducherry",
];

type FormData = z.infer<typeof formSchema>;

type SupplierBusinessType =
  Database["public"]["Tables"]["supplier_businesses"]["Insert"];

export function SupplierBusinessForm({
  existingBusiness,
}: {
  existingBusiness?: SupplierBusinessType | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: existingBusiness?.business_name || "",
      gst_number: existingBusiness?.gst_number || "",
      business_address: existingBusiness?.business_address || "",
      city: existingBusiness?.city || "",
      state: existingBusiness?.state || "",
      pincode: existingBusiness?.pincode || "",
      type: existingBusiness?.type || "MANUFACTURER",
      alternate_phone: existingBusiness?.alternate_phone || "",
    },
  });

  const handleProfilePicUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Profile picture must be a JPG or PNG image.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Profile picture must be under 2MB.");
      return;
    }

    setProfilePic(file);
    toast.success("Profile picture selected.");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, JPEG, or PNG file");
        return;
      }

      if (file.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setUploadedFile(file);
      toast.success("File uploaded successfully");
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Here you would typically:
      // 1. Upload the GST certificate file to storage (Supabase Storage, etc.)
      // 2. Get the file URL
      // 3. Submit the form data to your API/database

      let gstCertificateUrl = existingBusiness?.gst_certificate_url || null;
      if (uploadedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", uploadedFile);

        const uploadResponse = await axios.post(
          "/api/gst-certificate",
          fileFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.data.publicUrl) {
          gstCertificateUrl = uploadResponse.data.publicUrl;
          toast.success("GST certificate uploaded successfully");
        }
      }

      let profilePicUrl = existingBusiness?.profile_avatar_url || null;
      if (profilePic) {
        const picFormData = new FormData();
        picFormData.append("file", profilePic);

        const picUploadRes = await axios.post(
          "/api/profile-picture",
          picFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (picUploadRes.data.publicUrl) {
          profilePicUrl = picUploadRes.data.publicUrl;
          toast.success("Profile picture uploaded.");
        }
      }

      console.log("GST certificate URL:", gstCertificateUrl);
      console.log("Profile picture URL:", profilePicUrl);
      console.log("Form data:", data);
      console.log("Uploaded file:", uploadedFile);

      // Simulate API call
      const res = await axios.post("/api/create-business", {
        ...data,
        gst_certificate_url: gstCertificateUrl,
        profile_avatar_url: profilePicUrl,
      });

      toast.success("Supplier business registered successfully!");
      form.reset();
      setUploadedFile(null);
      router.push("/supplier");
    } catch (error: any) {
      console.error("Frontend API Error:", error);

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message =
          error.response?.data?.message || "Unknown error occurred";

        switch (status) {
          case 400:
            toast.error("Bad Request: " + message);
            break;
          case 401:
            toast.error("Unauthorized: " + message);
            // Optionally redirect to login
            break;
          case 503:
            toast.error("Service Unavailable: " + message);
            break;
          case 500:
            toast.error("Server Error: " + message);
            break;
          default:
            toast.error("Error: " + message);
        }
      } else {
        // Non-Axios errors
        toast.error("Unexpected error: " + error.message || error.toString());
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (existingBusiness && existingBusiness.status === "PENDING") {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center border-yellow-500 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center justify-center space-x-2 text-yellow-600">
            <Clock className="w-6 h-6" />
            <CardTitle className="text-yellow-700">
              Application Pending
            </CardTitle>
          </div>
          <CardDescription>
            Your supplier business application is currently under review.
            <br />
            You’ll be notified once it’s approved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700">
            If you have questions, contact support or wait 24–48 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {existingBusiness && existingBusiness.status === "REJECTED" && (
        <Card className="w-full max-w-2xl mx-auto p-6 mb-4">
          <CardTitle className="text-red-500">Application Rejected</CardTitle>
          <CardDescription>
            Unfortunately, your supplier business application was not approved.
            Please review the feedback below and make the necessary corrections
            before resubmitting.
          </CardDescription>
          <CardContent>
            <p className="text-sm text-red-700">{existingBusiness?.message}</p>
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Register Supplier Business</CardTitle>
          <CardDescription>
            Please fill in all the required information to register your
            business as a supplier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your business name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gst_number"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>GST Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="22AAAAA0000A1Z5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your 15-digit GST registration number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Business Address *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your complete business address"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city name" {...field} />
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
                      <FormLabel>State *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="alternate_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternate Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter alternate phone number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 15); // optional formatting
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional secondary contact number
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
                    <FormLabel>Business Type *</FormLabel>
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
                        {businessTypeOptions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() +
                              type.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Profile Picture (Optional)
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {profilePic ? (
                            <>
                              <img
                                src={URL.createObjectURL(profilePic)}
                                alt="Preview"
                                className="w-16 h-16 rounded-full mb-2 object-cover"
                              />
                              <p className="text-sm text-gray-600">
                                {profilePic.name}
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                profile picture
                              </p>
                              <p className="text-xs text-gray-500">
                                JPG or PNG, max 2MB
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={handleProfilePicUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    GST Certificate (Optional)
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploadedFile ? (
                            <>
                              <FileText className="w-8 h-8 mb-2 text-green-500" />
                              <p className="text-sm text-gray-600">
                                {uploadedFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                GST certificate
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF, PNG, JPG up to 5MB
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    form.reset();
                    setUploadedFile(null);
                    setProfilePic(null);
                  }}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {existingBusiness ? "Updating..." : "Registering..."}
                    </>
                  ) : existingBusiness ? (
                    "Update Business"
                  ) : (
                    "Register Business"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
