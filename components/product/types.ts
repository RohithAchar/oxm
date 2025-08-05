import { z } from "zod";

const tierPriceSchema = z.object({
  qty: z.number().min(1, "Quantity is required"),
  price: z.number().min(1, "Price is required"),
  isActive: z.boolean().default(true).optional(),
  height: z.number().min(1, "Product height is required"),
  weight: z.number().min(1, "Product weight is required"),
  length: z.number().min(1, "Product length is required"),
  breadth: z.number().min(1, "Product breadth is required"),
});

const specificationSchema = z.object({
  spec_name: z.string().min(1, "Specification name is required"),
  spec_value: z.string().min(1, "Specification value is required"),
  spec_unit: z.string().optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z
    .string()
    .min(10, "Product description is required")
    .max(500, "Product description must be less than 500 characters"),
  brand: z.string().min(1, "Product brand is required"),
  categoryId: z.string().min(1, "Product category is required"),
  subCategoryId: z.string().min(1, "Product sub category is required"),
  tiers: z.array(tierPriceSchema).min(1, "At least one tier is required"),
  sample_available: z.boolean().default(true).optional(),
  is_active: z.boolean().default(true).optional(),
  country_of_origin: z.string().optional(),
  hsn_code: z.string().optional(),
  youtube_link: z.string().optional(),
  supplier_id: z.string().optional(),
  specifications: z
    .array(specificationSchema)
    .min(1, "At least one spec is required"),
});
