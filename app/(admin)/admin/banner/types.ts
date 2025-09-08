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

export const BannerFormSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    alt_text: z.string().min(1, "Alt text is required"),
    is_active: z.boolean(),
    link_url: z.string().optional(),
    start_at: z.string(),
    end_at: z.string(),
    image: z.any().optional(), // file or undefined
    image_url: z.string().url().optional(), // existing image when editing
  })
  .refine(
    (data) => {
      // If no id (creating), require either new file or image_url
      if (!data.id) {
        return data.image instanceof File;
      }
      // If editing, no requirement
      return true;
    },
    {
      message: "Image is required for new banners",
      path: ["image"], // error will be shown under image field
    }
  );
