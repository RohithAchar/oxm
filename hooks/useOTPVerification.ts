"use client";

import { useState } from "react";
import { OTPResponse } from "@/types/auth";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export const useOTPVerification = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const supabase = createClient();

  const sendOTP = async (phone: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: "sms",
        },
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      setOtpSent(true);
      toast.success("OTP sent successfully!");
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (
    phone: string,
    token: string
  ): Promise<OTPResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      if (data.user) {
        toast.success("Phone verified successfully!");
        return {
          success: true,
          message: "Phone verified successfully!",
          user: data.user,
        };
      }

      return { success: false, message: "Verification failed" };
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const message = "Failed to verify OTP";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (phone: string): Promise<boolean> => {
    return await sendOTP(phone);
  };

  return {
    loading,
    otpSent,
    sendOTP,
    verifyOTP,
    resendOTP,
    setOtpSent,
  };
};
