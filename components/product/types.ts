import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z
    .string()
    .min(10, "Product description is required")
    .max(500, "Product description must be less than 500 characters"),
  brand: z.string().min(1, "Product brand is required"),
  categoryId: z.string().min(1, "Product category is required"),
  subCategoryId: z.string().min(1, "Product sub category is required"),
});
