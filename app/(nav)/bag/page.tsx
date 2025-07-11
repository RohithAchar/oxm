import {
  LucideStore,
  MousePointer2,
  Package,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { createClient } from "@/utils/supabase/server";

export default async function Bag() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = session !== null;

  let hasBusiness = false;
  if (isAuthenticated) {
    const business = await supabase
      .from("supplier_businesses")
      .select("*")
      .eq("profile_id", session?.user.id)
      .single();

    if (business.data) {
      hasBusiness = true;
    }
  }

  return (
    <div
      style={{ minHeight: "calc(100vh - 44px)" }}
      className="flex flex-col justify-between py-8 px-12 bg-muted pb-40"
    >
      <p className="text-2xl font-medium">Your bag is empty</p>
      <div className="space-y-4">
        <p className="text-muted-foreground">My Profile</p>
        <Link
          className="flex items-center gap-3 text-muted-foreground hover:text-black"
          href={"/orders"}
        >
          <Package strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
          <p className="text-black">Orders</p>
        </Link>
        <Link
          className="flex items-center gap-3 text-muted-foreground hover:text-black"
          href={"/profile"}
        >
          <Settings strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
          <p className="text-black">Profile</p>
        </Link>
        {hasBusiness ? (
          <Link
            className="flex items-center gap-3 text-muted-foreground hover:text-black"
            href={"/supplier"}
          >
            <LucideStore
              strokeWidth={1.5}
              className="h-4.5 w-4.5 cursor-pointer"
            />
            <p className="text-black">Dashboard</p>
          </Link>
        ) : (
          <Link
            className="flex items-center gap-3 text-muted-foreground hover:text-black"
            href={"/create-business"}
          >
            <MousePointer2
              strokeWidth={1.5}
              className="h-4.5 w-4.5 cursor-pointer"
            />
            <p className="text-black">Create Business</p>
          </Link>
        )}
        {isAuthenticated ? (
          <LogoutButton />
        ) : (
          <Link
            className="flex items-center gap-3 text-muted-foreground hover:text-black"
            href={"/login"}
          >
            <User strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
            <p className="text-black">Sign in</p>
          </Link>
        )}
      </div>
    </div>
  );
}
