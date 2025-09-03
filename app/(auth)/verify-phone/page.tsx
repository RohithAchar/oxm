"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"enter" | "verify">("enter");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPhone = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("profiles")
          .select("phone_number")
          .eq("id", user.id as any)
          .single();
        if (data?.phone_number) {
          const str = String(data.phone_number).replace(/\D/g, "");
          setPhone(str.slice(-10));
        }
      } catch {}
    };
    loadPhone();
  }, []);

  const sendOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      toast.success("OTP sent");
      setStep("verify");
    } catch (e: any) {
      toast.error(e.message || "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed");
      toast.success("Phone verified");
      router.replace("/create-business");
    } catch (e: any) {
      toast.error(e.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Verify your phone</h1>
          <p className="text-sm text-muted-foreground">
            Enter your Indian mobile number to receive a 6-digit OTP.
          </p>
        </div>

        {step === "enter" ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="flex gap-2">
                <div className="inline-flex items-center px-3 rounded-md border bg-muted text-muted-foreground">
                  +91
                </div>
                <Input
                  id="phone"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <Button className="w-full" onClick={sendOtp} disabled={loading || phone.length !== 10}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enter the 6-digit code</Label>
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep("enter")} disabled={loading}>
                Change number
              </Button>
              <Button className="flex-1" onClick={verifyOtp} disabled={loading || code.length !== 6}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


