import { z } from "zod";

export const BannerSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  image_url: z.string().url("Invalid image URL"),
  alt_text: z.string().max(200, "Alt text too long").optional(),
  is_active: z.boolean().default(true),
  link_url: z
    .string()
    .url("Invalid URL")
    .or(z.string().regex(/^\//, "Must be a valid URL or path"))
    .optional(),
  start_at: z.string().datetime().optional(),
  end_at: z.string().datetime().optional(),
  click_count: z.number().int().min(0).default(0).optional(),
  impression_count: z.number().int().min(0).default(0).optional(),
});

export const BannerFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  alt_text: z
    .string()
    .min(1, "Alt text is required")
    .max(200, "Alt text too long"),
  is_active: z.boolean().default(true), // Remove .optional()
  link_url: z.string().min(1, "Link URL is required"),
  start_at: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "Start date must be in YYYY-MM-DDTHH:MM format"
    ),

  end_at: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "End date must be in YYYY-MM-DDTHH:MM format"
    ),

  image: z.custom<File>(
    (file) => {
      if (!(file instanceof File)) return false;
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 0.5 * 1024 * 1024;
      return allowedTypes.includes(file.type) && file.size <= maxSize;
    },
    {
      message: "Image must be JPEG/PNG/WEBP and under 500KB",
    }
  ),
});
