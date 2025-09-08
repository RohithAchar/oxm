"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV !== "development"
    ) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("SW registration failed", error);
        }
      };
      register();
    }
  }, []);

  return null;
}
