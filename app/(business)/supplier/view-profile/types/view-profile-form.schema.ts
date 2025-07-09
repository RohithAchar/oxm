// view-profile-form.schema.ts
import { z } from "zod";

export const viewProfileSchema = z.object({
  business_name: z.string().min(2, "Required"),
  business_address: z.string().min(2, "Required"),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  pincode: z.string().min(4, "Required"),
});

export type ViewProfileSchema = z.infer<typeof viewProfileSchema>;
