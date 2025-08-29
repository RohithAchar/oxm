"use client";

import Msg91Widget from "@/components/otp/Msg91Widget";

export default function VerifyPhonePage() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold mb-4">Verify your phone</h1>
      <p className="text-sm text-muted-foreground mb-6">
        We use MSG91 to verify your phone number securely.
      </p>

      <Msg91Widget
        widgetId="356843674878363736303733"
        tokenAuth="465479TkA4B0Zt968ac47c3P1"
        exposeMethods={false}
        onSuccess={async (data: any) => {
          try {
            const token =
              data?.accessToken ||
              data?.access_token ||
              data?.["access-token"] ||
              data?.token;
            if (!token) {
              console.log(
                "MSG91: missing access token in success payload",
                data
              );
              return;
            }

            const res = await fetch("/api/msg91/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ "access-token": token }),
            });
            const json = await res.json();
            console.log("Server verification result", json);
          } catch (err) {
            console.log("Failed to verify token on server", err);
          }
        }}
        onFailure={(error) => {
          console.log("Verification failed", error);
        }}
      />

      {/* The MSG91 widget renders its own UI after script loads */}
    </main>
  );
}
