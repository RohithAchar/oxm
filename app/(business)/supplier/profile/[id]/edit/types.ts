import { z } from "zod";

// Define business types as a const array
export const businessType = [
  "MANUFACTURER",
  "WHOLESALER",
  "DISTRIBUTOR",
  "TRADER / RESELLER",
  "DROPSHIPPER",
  "EXPORTER",
  "IMPORTER",
  "OTHER",
] as const;

// Create the business update schema
export const BusinessUpdateSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_address: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  type: z.enum(businessType, "Business type is required"),
  alternate_phone: z
    .string()
    .min(10, "Alternate phone number must be at least 10 digits"),
});

// Infer the TypeScript type from the schema
export type FormData = z.infer<typeof BusinessUpdateSchema>;

// Alternative approach using .refine() for custom error messages
export const BusinessUpdateSchemaWithCustomErrors = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_address: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  type: z.enum(businessType).refine((val) => businessType.includes(val), {
    message: "Invalid business type",
  }),
  alternate_phone: z
    .string()
    .min(10, "Alternate phone number must be at least 10 digits"),
});

// Another alternative using z.union() with literals for more control
export const BusinessUpdateSchemaWithUnion = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_address: z.string().min(1, "Business address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  type: z.union([
    z.literal("MANUFACTURER"),
    z.literal("WHOLESALER"),
    z.literal("DISTRIBUTOR"),
    z.literal("TRADER / RESELLER"),
    z.literal("DROPSHIPPER"),
    z.literal("EXPORTER"),
    z.literal("IMPORTER"),
    z.literal("OTHER"),
  ]),
  alternate_phone: z
    .string()
    .min(10, "Alternate phone number must be at least 10 digits"),
});

// Export business type as a union type for TypeScript
export type BusinessType = (typeof businessType)[number];
