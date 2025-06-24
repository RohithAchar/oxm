"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface PhoneVerificationProps {
  onVerificationSuccess?: (phoneNumber: string) => void;
}

export default function PhoneVerification({
  onVerificationSuccess,
}: PhoneVerificationProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const formatPhoneNumber = (phone: string) => {
    // Add +91 if not present and format for Indian numbers
    if (!phone.startsWith("+")) {
      return `+91${phone}`;
    }
    return phone;
  };

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const res = await axios.post(
        "/api/send-otp",
        {
          phoneNumber: formattedPhone,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      if (data.success) {
        setStep("otp");
        setSuccess("OTP sent successfully!");
      } else {
        // Show detailed error information
        const errorMsg = data.error || "Failed to send OTP";
        const errorCode = data.code ? ` (Code: ${data.code})` : "";
        setError(`${errorMsg}${errorCode}`);
        console.error("OTP Error Details:", data);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const res = await axios.post(
        "/api/verify-otp",
        {
          phoneNumber: formattedPhone,
          code: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      if (data.success) {
        setSuccess("Phone number verified successfully!");
        onVerificationSuccess?.(formattedPhone);
        toast.success("Phone number verified successfully!");
        router.push("/");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    setError("");
    setSuccess("");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          {step === "phone" ? (
            <Phone className="h-6 w-6 text-blue-600" />
          ) : (
            <Shield className="h-6 w-6 text-green-600" />
          )}
        </div>
        <CardTitle>
          {step === "phone" ? "Verify Phone Number" : "Enter OTP"}
        </CardTitle>
        <CardDescription>
          {step === "phone"
            ? "We'll send you a verification code"
            : `Enter the 6-digit code sent to ${phoneNumber}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {step === "phone" ? (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ""))
                }
                className="rounded-l-none"
                maxLength={10}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        {step === "phone" ? (
          <Button
            onClick={sendOTP}
            disabled={loading || !phoneNumber}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        ) : (
          <>
            <Button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
            <Button variant="outline" onClick={resetFlow} className="w-full">
              Change Phone Number
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
