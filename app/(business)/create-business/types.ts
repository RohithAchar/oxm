import z from "zod";

export const createBusinessformSchema = z.object({
  businessName: z.string().min(3, "Business name is required"),
  about: z
    .string()
    .max(3000, "About must be at most 3000 characters")
    .optional(),
  gstNumber: z
    .string()
    .min(15, "GST Number is required")
    .max(15, "GST Number must be 15 characters")
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST Number format"
    ),
  businessAddress: z.string().min(3, "Business address is required"),
  city: z.string().min(3, "City is required"),
  state: z.string().min(3, "State is required"),
  pincode: z.string().min(6, "Pincode is required"),
  type: z.enum([
    "MANUFACTURER",
    "WHOLESALER",
    "DISTRIBUTOR",
    "TRADER / RESELLER",
    "DROPSHIPPER",
    "EXPORTER",
    "IMPORTER",
    "OTHER",
  ]),
  main_phone: z
    .string()
    .min(10, "Main phone number is required")
    .max(10, "Main phone number must be 10 characters"),
  alternative_phone: z
    .string()
    .min(10, "Alternative phone number is required")
    .max(10, "Alternative phone number must be 10 characters"),
  profile_pic: z.custom<File>(
    (file) => {
      if (!(file instanceof File)) return false;

      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      return file.size <= maxSizeInBytes && allowedTypes.includes(file.type);
    },
    {
      message: "Profile picture must be JPEG, PNG, or WEBP and under 1MB",
    }
  ),
  gst_certificate: z
    .custom<File>(
      (file) => {
        if (!(file instanceof File)) return false;

        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/pdf",
        ];

        return file.size <= maxSizeInBytes && allowedTypes.includes(file.type);
      },
      {
        message:
          "GST certificate must be JPEG, PNG, WEBP, or PDF and under 5MB",
      }
    )
    .optional(),
});
