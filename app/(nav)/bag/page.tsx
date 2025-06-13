import { Package, Settings, Store, User } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { createClient } from "@/utils/supabase/server";

export default async function Bag() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthenticated = session !== null;

  return (
    <div
      style={{ minHeight: "calc(100vh - 44px)" }}
      className="flex flex-col justify-between py-8 px-12 bg-muted pb-20"
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
        {/* {isAuthenticated && hasBusiness ? (
          <Link
            className="flex items-center gap-3 text-muted-foreground hover:text-black"
            href={"/business"}
          >
            <Store strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
            <p className="text-black">Business</p>
          </Link>
        ) : (
          <Link
            className="flex items-center gap-3 text-muted-foreground hover:text-black"
            href={"/business-create"}
          >
            <Store strokeWidth={1.5} className="h-4.5 w-4.5 cursor-pointer" />
            <p className="text-black">Create business</p>
          </Link>
        )} */}
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
