import { Sidebar } from "@/components/admin/sidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Admin | OpenXmart",
  description: "Manage suppliers, products, and platform operations.",
  keywords: ["B2B admin", "admin portal", "manage business", "OpenXmart admin"],
};

export default async function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  const name = "Admin";
  const username = user.user?.user_metadata.full_name || "Joe Bloggs";
  const email = user.user?.user_metadata.email || "joe@example.com";
  const profileUrl =
    user.user?.user_metadata.picture || "/placeholder-profile.png";

  return (
    <div className="md:flex">
      {/* Sidebar on desktop, top tabs on mobile */}
      <Sidebar
        profileUrl={profileUrl}
        name={name}
        username={username}
        email={email}
        userProfileUrl={profileUrl}
      />

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 mx-auto max-w-7xl">{children}</main>
    </div>
  );
}
