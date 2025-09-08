"use client";

import React from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface LogoutButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "ghost"
    | "link"
    | "outline"
    | "secondary";
  children?: React.ReactNode;
}

export default function LogoutButton({
  className,
  variant,
  children,
}: LogoutButtonProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant={variant || "ghost"}
      className={`text-base ${className}`}
    >
      {children || "Logout"}
    </Button>
  );
}
