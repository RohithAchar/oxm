import { z } from "zod";

export const BusinessSchema = z.object({
  business_name: z.string().min(1, "Business name is required."),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN."
    ),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN."),
  business_type: z.string().min(1, "Business type is required."),
  address_line1: z.string().min(1, "Address line 1 is required."),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  pincode: z.string().min(1, "Pincode is required."),
  country: z.string().min(1, "Country is required."),
  business_phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number."),
  business_email: z.string().email("Invalid email address."),
  website_url: z.string().url().optional(),
  gst_certificate_url: z.string().url().optional(),
  pan_card_url: z.string().url().optional(),
  business_license_url: z.string().url().optional(),
});

export type BusinessInput = z.infer<typeof BusinessSchema>;
