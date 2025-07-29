// app/(business)/supplier/layout.tsx

import { Sidebar } from "@/components/supplier/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Suppliers – OpenXmart",
  description:
    "Connect with trusted B2B suppliers. Manage your business profile, products, and orders.",
  keywords: [
    "B2B suppliers",
    "supplier portal",
    "manage products",
    "OpenXmart business",
  ],
};

export default async function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  let businessData = null;
  if (user.user?.id) {
    const { data: business } = await supabase
      .from("supplier_businesses")
      .select("*")
      .eq("profile_id", user.user?.id)
      .single();

    if (!business) {
      redirect("/create-business");
    }

    if (business.is_verified === false) {
      redirect("/create-business");
    }

    businessData = business;
  }

  return (
    <div className="flex flex-col lg:flex-row py-6">
      <Sidebar
        profileUrl={
          businessData?.profile_avatar_url || "/placeholder-profile.png"
        }
        name={businessData?.business_name || ""}
        username={user.user?.user_metadata.full_name || "Joe Bloggs"}
        email={user.user?.user_metadata.email || "joe@example.com"}
        userProfileUrl={
          user.user?.user_metadata.picture || "/placeholder-profile.png"
        }
      />
      <main className="flex-1 px-4 lg:px-4 pt-4 lg:pt-0">{children}</main>
    </div>
  );
}
