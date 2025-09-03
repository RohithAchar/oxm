"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PhoneNumberPopover() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/phone-number-exists", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data && data.exists === false) {
          setOpen(true);
        }
      } catch {}
    })();
  }, []);

  const onSubmit = async () => {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(value)) {
      toast.error("Enter a valid 10-digit Indian number");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/phone-number-exists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: value }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to save number");
      }
      toast.success("Phone number saved");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="w-80 p-0">
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Add your phone number</h3>
            <p className="text-sm text-muted-foreground">
              We use your Indian mobile number for order updates and support.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone number</Label>
            <div className="flex gap-2">
              <div className="px-3 h-10 rounded-md border bg-muted/40 text-foreground grid place-items-center text-sm font-medium">
                +91
              </div>
              <Input
                id="phone"
                inputMode="numeric"
                placeholder="9876543210"
                maxLength={10}
                value={value}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setValue(digits);
                }}
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>
              Not now
            </Button>
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


