// app/(business)/supplier/layout.tsx

import { Sidebar } from "@/components/admin/sidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Suppliers – OpenXmart",
  description: "Connect with trusted B2B suppliers. Manage your business",
  keywords: ["B2B admin", "admin portal", "manage business", "OpenXmart admin"],
};

export default async function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  return (
    <div className="flex">
      <Sidebar
        profileUrl={"/placeholder-profile.png"}
        name={"Admin"}
        username={user.user?.user_metadata.full_name || "Joe Bloggs"}
        email={user.user?.user_metadata.email || "joe@example.com"}
        userProfileUrl={
          user.user?.user_metadata.picture || "/placeholder-profile.png"
        }
      />
      <main className="flex-1 px-4">{children}</main>
    </div>
  );
}
