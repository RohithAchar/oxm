"use client";

import Script from "next/script";

export default function OTPProvider() {
  const init = () => {
    console.log("MSG91 script ready, initializing...");
    const config = {
      widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID!,
      tokenAuth: process.env.NEXT_PUBLIC_MSG91_API_KEY!,
      exposeMethods: false,
      success: (data: any) => console.log("OTP Success:", data),
      failure: (err: any) => console.log("OTP Failed:", err),
    };

    window.initSendOTP?.(config);
  };

  return (
    <Script
      src="https://verify.msg91.com/otp-provider.js"
      strategy="afterInteractive"
      onLoad={init}
    />
  );
}
