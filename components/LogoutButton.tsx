"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

type props = {
  className?: string;
  variant?: "default" | "destructive" | "ghost" | "link";
};

export default function LogoutButton({ className, variant }: props) {
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
      Logout
    </Button>
  );
}
