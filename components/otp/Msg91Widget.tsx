"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    initSendOTP?: (config: Record<string, any>) => void;
  }
}

type Msg91WidgetProps = {
  widgetId: string;
  tokenAuth: string;
  identifier?: string;
  exposeMethods?: boolean;
  body_1?: string;
  button_1?: string;
  onSuccess?: (data: unknown) => void;
  onFailure?: (error: unknown) => void;
};

export default function Msg91Widget({
  widgetId,
  tokenAuth,
  identifier,
  exposeMethods,
  body_1,
  button_1,
  onSuccess,
  onFailure,
}: Msg91WidgetProps) {
  const scriptAddedRef = useRef(false);

  useEffect(() => {
    if (scriptAddedRef.current) return;

    const configuration: Record<string, unknown> = {
      widgetId,
      tokenAuth,
      ...(identifier ? { identifier } : {}),
      ...(typeof exposeMethods === "boolean" ? { exposeMethods } : {}),
      ...(body_1 ? { body_1 } : {}),
      ...(button_1 ? { button_1 } : {}),
      success: (data: unknown) => {
        // eslint-disable-next-line no-console
        console.log("MSG91 success response", data);
        onSuccess?.(data);
      },
      failure: (error: unknown) => {
        // eslint-disable-next-line no-console
        console.log("MSG91 failure reason", error);
        onFailure?.(error);
      },
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;
    script.onload = () => {
      try {
        window.initSendOTP?.(configuration);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to init MSG91 OTP", err);
        onFailure?.(err);
      }
    };
    script.onerror = () => {
      const error = new Error("Failed to load MSG91 OTP script");
      // eslint-disable-next-line no-console
      console.error(error);
      onFailure?.(error);
    };

    document.body.appendChild(script);
    scriptAddedRef.current = true;

    return () => {
      // No documented teardown API; best effort removal of script tag
      try {
        document.body.removeChild(script);
      } catch {}
    };
  }, [
    widgetId,
    tokenAuth,
    identifier,
    exposeMethods,
    body_1,
    button_1,
    onSuccess,
    onFailure,
  ]);

  return null;
}
