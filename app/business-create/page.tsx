"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { BusinessSchema } from "@/lib/validations/business";

type BusinessFormData = z.infer<typeof BusinessSchema>;

export default function CreateBusinessForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(BusinessSchema),
  });

  const onSubmit = async (data: BusinessFormData) => {
    setSubmitting(true);
    const res = await fetch("/api/business", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) console.error("Error creating business:", json.error);
    else console.log("Business created:", json.data);
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create New Business
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Name */}
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700">Business Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Corporation"
                      {...field}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              )}
            />

            {/* GSTIN */}
            <FormField
              control={form.control}
              name="gstin"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700">GSTIN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="27XXXXX1234A1Z5"
                      {...field}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              )}
            />

            {/* PAN */}
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700">PAN</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABCDE1234F"
                      {...field}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              )}
            />

            {/* Business Type */}
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-gray-700">Business Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </div>
              )}
            />

            {/* Dynamic Fields */}
            {/* Added a grid layout for better organization of multiple fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "address_line1",
                "address_line2",
                "city",
                "state",
                "pincode",
                "country",
                "business_phone",
                "business_email",
                "website_url",
                "gst_certificate_url",
                "pan_card_url",
                "business_license_url",
              ].map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof BusinessFormData}
                  render={({ field }) => (
                    <div className="flex flex-col">
                      <FormLabel className="capitalize text-gray-700">
                        {name.replaceAll("_", " ")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={name.replaceAll("_", " ")}
                          {...field}
                          className="mt-1"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </div>
                  )}
                />
              ))}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-2 text-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              {submitting ? "Creating..." : "Create Business"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
