"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Tags, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type Json = Database["public"]["Tables"]["buy_leads"]["Row"]["customization"];

export function RFQButton({
  productId,
  productName,
  supplierId,
  supplierName,
  tierPricingSnapshot,
  variant = "button",
}: {
  productId: string;
  productName: string;
  supplierId: string;
  supplierName: string;
  tierPricingSnapshot?: any | null;
  variant?: "button" | "row";
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const rfqSchema = z
    .object({
      quantity: z
        .string()
        .min(1, "Quantity is required")
        .refine((v) => Number(v) > 0, "Enter a valid quantity"),
      targetPrice: z
        .string()
        .min(1, "Target price is required")
        .refine((v) => Number(v) > 0, { message: "Enter a valid price" }),
      deliveryPincode: z
        .string()
        .min(6, "Enter 6-digit pincode")
        .max(6, "Enter 6-digit pincode")
        .regex(/^[0-9]{6}$/g, "Enter a valid 6-digit pincode"),
      deliveryCity: z.string().optional(),
      customColor: z.string().optional(),
      customBranding: z.string().optional(),
      customPackaging: z.string().optional(),
      notes: z.string().optional(),
      contactEmail: z
        .string()
        .email("Invalid email")
        .optional()
        .or(z.literal("")),
      contactPhone: z
        .string()
        .regex(/^\d{10}$/g, "Enter 10-digit phone")
        .optional()
        .or(z.literal("")),
    })
    .refine(
      (data) =>
        (data.contactEmail && data.contactEmail !== "") ||
        (data.contactPhone && data.contactPhone !== ""),
      {
        message: "Provide at least one contact method",
        path: ["contactPhone"],
      }
    );

  type RFQFormValues = z.infer<typeof rfqSchema>;

  const form = useForm<RFQFormValues>({
    resolver: zodResolver(rfqSchema) as any,
    defaultValues: {
      quantity: "",
      targetPrice: "",
      deliveryPincode: "",
      deliveryCity: "",
      customColor: "",
      customBranding: "",
      customPackaging: "",
      notes: "",
      contactEmail: "",
      contactPhone: "",
    },
    mode: "onChange",
  });

  // Single dialog UX for all screen sizes (no drawer)

  useEffect(() => {
    if (!open) return;
    const loadContact = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, phone_number")
          .eq("id", user.id)
          .maybeSingle();
        if (profile) {
          const emailFromProfile = (profile as any).email ?? undefined;
          const phoneFromProfileRaw =
            (profile as any).phone_number ?? undefined;

          const userPhoneRaw =
            (user as any).phone ??
            (user as any).user_metadata?.phone ??
            (user as any).user_metadata?.phone_number;

          const normalise = (v: any) =>
            typeof v === "string"
              ? v.trim()
              : typeof v === "number"
              ? String(v)
              : undefined;
          const phoneResolved =
            normalise(phoneFromProfileRaw) || normalise(userPhoneRaw);
          form.setValue("contactEmail", emailFromProfile ?? user.email ?? "");
          form.setValue("contactPhone", phoneResolved ?? "");
        } else {
          form.setValue("contactEmail", user.email ?? "");
          const userPhoneRaw =
            (user as any).phone ??
            (user as any).user_metadata?.phone ??
            (user as any).user_metadata?.phone_number;
          if (userPhoneRaw)
            form.setValue(
              "contactPhone",
              typeof userPhoneRaw === "string" ? userPhoneRaw.trim() : ""
            );
        }
      } catch {}
    };
    loadContact();
  }, [open, form]);

  const customization: Json = useMemo(() => {
    const values = form.getValues();
    const obj: Record<string, string> = {};
    if (values.customColor) obj.color = values.customColor;
    if (values.customBranding) obj.branding = values.customBranding;
    if (values.customPackaging) obj.packaging = values.customPackaging;
    return Object.keys(obj).length ? (obj as any) : null;
  }, [
    form.watch("customColor"),
    form.watch("customBranding"),
    form.watch("customPackaging"),
  ]);

  const submit = async (values: RFQFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login to submit RFQ");

      const { error } = await supabase.from("buy_leads").insert({
        buyer_id: user.id,
        supplier_id: supplierId,
        product_id: productId,
        product_name: productName,
        supplier_name: supplierName,
        quantity_required: values.quantity ? Number(values.quantity) : null,
        target_price: values.targetPrice ? Number(values.targetPrice) : null,
        delivery_pincode: values.deliveryPincode || null,
        delivery_city: values.deliveryCity || null,
        customization: customization as any,
        notes: values.notes || null,
        contact_email: values.contactEmail || null,
        contact_phone: values.contactPhone || null,
        tier_pricing_snapshot: tierPricingSnapshot || null,
        currency: "INR",
      });
      if (error) throw error;
      toast.success("RFQ submitted", {
        description: "We notified the supplier.",
      });
      setOpen(false);
      form.reset();
    } catch (e: any) {
      setError(e.message || "Failed to submit RFQ");
      toast.error("Submission failed", {
        description: e.message || "Try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const FormBody = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <Card>
          <CardContent className="pt-4 text-sm text-muted-foreground">
            <div className="font-medium text-foreground mb-1">
              {productName}
            </div>
            <div>Supplier: {supplierName}</div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Request details</h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Quantity required*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="e.g. 1000 (typical orders 100–5,000)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Target price (₹)*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="Your desired unit price (₹)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Delivery details</h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="deliveryPincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Delivery pincode*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="6-digit Indian pincode (e.g. 560001)"
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Delivery city</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bengaluru, Karnataka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <Tags className="h-3.5 w-3.5" />
              <span>Customization (optional)</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomization((v) => !v)}
            >
              {showCustomization ? "Hide" : "Add"}
            </Button>
          </div>
          {showCustomization && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="customColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Color</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Red / Blue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customBranding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Branding</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Logo printing, custom label"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customPackaging"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Packaging</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 10 units per box" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Additional details</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes((v) => !v)}
            >
              {showNotes ? "Hide" : "Add"}
            </Button>
          </div>
          {showNotes && (
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Key specs, timelines, or delivery constraints"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Contact information</h3>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Contact email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Contact phone</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      placeholder="9876543210"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            Provide at least one contact
          </p>
        </div>

        {error && <div className="text-xs text-destructive">{error}</div>}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            className="px-6"
            disabled={submitting || !form.formState.isValid}
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting
              </span>
            ) : (
              "Submit RFQ"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  const TriggerContent =
    variant === "row" ? (
      <button
        type="button"
        className=" w-full bg-background cursor-pointer rounded-lg p-4 focus:outline-none border hover:bg-muted/60 transition"
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">Get Best Price</span>
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              RFQ
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </button>
    ) : (
      <Button className="w-full sm:w-auto">Get Best Price</Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{TriggerContent}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request for Quote</DialogTitle>
        </DialogHeader>
        <div className="pr-1 pb-20">{FormBody}</div>
      </DialogContent>
    </Dialog>
  );
}

export default RFQButton;
