import { z } from "zod";

const imageSchema = z.custom<File | undefined>(
  (file) => {
    // Allow undefined (for existing images in edit mode)
    if (file === undefined) return true;

    // If it's a File, validate it
    if (file instanceof File) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      return file.size <= maxSizeInBytes && allowedTypes.includes(file.type);
    }

    return false;
  },
  {
    message:
      "Product image must be JPEG, PNG, or WEBP and under 1MB, or leave empty to keep existing image",
  }
);

const imageFieldSchema = z.object({
  image: imageSchema,
  display_order: z.number().min(1, "Display order is required"),
  existingUrl: z.string().optional(), // For editing existing images
});

// Custom validation for product images that allows existing images
const productImagesSchema = z
  .array(imageFieldSchema)
  .min(1, "At least one image is required")
  .max(5, "Maximum 5 images allowed")
  .refine(
    (images) => {
      // For edit mode: allow if at least one image has a file OR existingUrl
      // For add mode: require at least one file
      return images.some((img) => img.image || img.existingUrl);
    },
    {
      message:
        "At least one product image is required. You can upload new images or keep existing ones.",
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

  images: productImagesSchema,

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

  // New fields
  dropship_available: z.boolean().default(false).optional(),
  dropship_price: z.number().optional(), // store in paise if consistent
  white_label_shipping: z.boolean().default(false).optional(),
  dispatch_time: z.number().optional(), // days
});
