import { z } from "zod";

const imageSchema = z.custom<File | undefined>(
  (file) => {
    if (!(file instanceof File)) return false;

    const maxSizeInBytes = 0.5 * 1024 * 1024; // 500KB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    return file.size <= maxSizeInBytes && allowedTypes.includes(file.type);
  },
  {
    message: "Profile picture must be JPEG, PNG, or WEBP and under 1MB",
  }
);

const tierPriceSchema = z.object({
  qty: z.number().min(1, "Quantity is required").or(z.undefined()),
  price: z.number().min(1, "Price is required").or(z.undefined()),
  isActive: z.boolean().default(true).optional(),
});

const specificationSchema = z.object({
  spec_name: z.string().optional(),
  spec_value: z.string().optional(),
  spec_unit: z.string().optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z
    .string()
    .min(10, "Product description is required")
    .max(2000, "Product description must be less than 2000 characters"),
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
  specifications: z.array(specificationSchema).optional(),
  images: z
    .array(
      z.object({
        image: imageSchema,
        display_order: z.number().min(1, "Display order is required"),
      })
    )
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),
  height: z.number().optional(),
  weight: z.number().optional(),
  length: z.number().optional(),
  breadth: z.number().optional(),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .min(1, "At least one tag is required")
    .max(5, "You can add up to 5 tags only"),
  quantity: z.number().optional(),
  price_per_unit: z.number().optional(),
  total_price: z.number().optional(),
  is_bulk_pricing: z.boolean().optional(),
});
