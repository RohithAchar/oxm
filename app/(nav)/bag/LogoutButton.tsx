"use client";

import { createClient } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // router.push("/login");
    toast.success("You have been logged out successfully");
    router.refresh();
  };

  return (
    <div
      className="flex items-center gap-3 text-muted-foreground hover:text-black cursor-pointer"
      onClick={handleSignOut}
    >
      <LogOut strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
      <p className="text-black cursor-pointer">Logout</p>
    </div>
  );
}
