import { Database } from "@/utils/supabase/database.types";
import { z } from "zod";

export const formSchema = z.object({
  business_name: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  gst_number: z
    .string()
    .min(15, "GST number must be 15 characters")
    .max(15, "GST number must be 15 characters")
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number format"
    ),
  business_address: z
    .string()
    .min(10, "Business address must be at least 10 characters"),
  city: z.string().min(2, "City name must be at least 2 characters"),
  state: z.string().min(1, "Please select a state"),
  pincode: z
    .string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^[0-9]{6}$/, "Pincode must contain only numbers"),
  gst_certificate_url: z.any().optional(),
  profile_avatar_url: z.string().optional(),
});

export type Business =
  Database["public"]["Tables"]["supplier_businesses"]["Row"];
