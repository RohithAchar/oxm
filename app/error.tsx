"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { H2 } from "@/components/ui/h2";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <H2 className="text-center">Something went wrong!</H2>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </Button>
    </main>
  );
}
