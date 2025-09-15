"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Database } from "@/utils/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const [quantity, setQuantity] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [deliveryPincode, setDeliveryPincode] = useState<string>("");
  const [deliveryCity, setDeliveryCity] = useState<string>("");
  const [customColor, setCustomColor] = useState<string>("");
  const [customBranding, setCustomBranding] = useState<string>("");
  const [customPackaging, setCustomPackaging] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");

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

          setContactEmail(emailFromProfile ?? user.email ?? "");
          setContactPhone(phoneResolved ?? "");
        } else {
          setContactEmail(user.email ?? "");
          const userPhoneRaw =
            (user as any).phone ??
            (user as any).user_metadata?.phone ??
            (user as any).user_metadata?.phone_number;
          if (userPhoneRaw)
            setContactPhone(
              typeof userPhoneRaw === "string" ? userPhoneRaw.trim() : ""
            );
        }
      } catch {}
    };
    loadContact();
  }, [open]);

  const customization: Json = useMemo(() => {
    const obj: Record<string, string> = {};
    if (customColor) obj.color = customColor;
    if (customBranding) obj.branding = customBranding;
    if (customPackaging) obj.packaging = customPackaging;
    return Object.keys(obj).length ? (obj as any) : null;
  }, [customColor, customBranding, customPackaging]);

  const submit = async () => {
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
        quantity_required: quantity ? Number(quantity) : null,
        target_price: targetPrice ? Number(targetPrice) : null,
        delivery_pincode: deliveryPincode || null,
        delivery_city: deliveryCity || null,
        customization: customization as any,
        notes: notes || null,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null,
        tier_pricing_snapshot: tierPricingSnapshot || null,
        currency: "INR",
      });
      if (error) throw error;
      toast.success("RFQ submitted", {
        description: "We notified the supplier.",
      });
      setOpen(false);
      // reset
      setQuantity("");
      setTargetPrice("");
      setDeliveryPincode("");
      setDeliveryCity("");
      setCustomColor("");
      setCustomBranding("");
      setCustomPackaging("");
      setNotes("");
    } catch (e: any) {
      setError(e.message || "Failed to submit RFQ");
      toast.error("Submission failed", {
        description: e.message || "Try again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const Form = (
    <div className="space-y-5">
      <Card>
        <CardContent className="pt-4 text-sm text-muted-foreground">
          <div className="font-medium text-foreground mb-1">{productName}</div>
          <div>Supplier: {supplierName}</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="quantity" className="text-xs">
            Quantity required
          </Label>
          <Input
            id="quantity"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="targetPrice" className="text-xs">
            Target price (₹)
          </Label>
          <Input
            id="targetPrice"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 120"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="pincode" className="text-xs">
            Delivery pincode
          </Label>
          <Input
            id="pincode"
            placeholder="e.g. 560001"
            inputMode="numeric"
            value={deliveryPincode}
            onChange={(e) => setDeliveryPincode(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="city" className="text-xs">
            Delivery city
          </Label>
          <Input
            id="city"
            placeholder="e.g. Bengaluru"
            value={deliveryCity}
            onChange={(e) => setDeliveryCity(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Tags className="h-3.5 w-3.5" /> Customization
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="color" className="text-xs">
              Color
            </Label>
            <Input
              id="color"
              placeholder="e.g. Red"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="branding" className="text-xs">
              Branding
            </Label>
            <Input
              id="branding"
              placeholder="e.g. Logo printing"
              value={customBranding}
              onChange={(e) => setCustomBranding(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="packaging" className="text-xs">
              Packaging
            </Label>
            <Input
              id="packaging"
              placeholder="e.g. Box of 10"
              value={customPackaging}
              onChange={(e) => setCustomPackaging(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes" className="text-xs">
          Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Any additional details"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="email" className="text-xs">
            Contact email
          </Label>
          <Input
            id="email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-xs">
            Contact phone
          </Label>
          <Input
            id="phone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="text-xs text-destructive">{error}</div>}

      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button onClick={submit} disabled={submitting}>
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting
            </span>
          ) : (
            "Submit RFQ"
          )}
        </Button>
      </div>
    </div>
  );

  const TriggerContent =
    variant === "row" ? (
      <button
        type="button"
        className="mb-4 w-full bg-background cursor-pointer rounded-lg p-4 focus:outline-none border hover:bg-muted/60 transition"
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
        <div className="pr-1 pb-20">{Form}</div>
      </DialogContent>
    </Dialog>
  );
}

export default RFQButton;
