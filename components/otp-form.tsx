"use client";

import { useState } from "react";

export default function OTPForm() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = () => {
    console.log("Sending OTP to:", phone);
    window.sendOtp?.(
      phone,
      (data) => console.log("OTP sent:", data),
      (err) => console.error("Send error:", err)
    );
  };

  const verifyOtp = () => {
    window.verifyOtp?.(
      otp,
      (data) => console.log("OTP verified:", data),
      (err) => console.error("Verify error:", err)
    );
  };

  return (
    <div className="space-y-4">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone (91...)"
        className="border p-2"
      />
      <button onClick={sendOtp} className="bg-blue-500 text-white p-2">
        Send OTP
      </button>

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="border p-2"
      />
      <button onClick={verifyOtp} className="bg-green-500 text-white p-2">
        Verify OTP
      </button>
    </div>
  );
}
