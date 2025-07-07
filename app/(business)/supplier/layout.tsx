import { Sidebar } from "@/components/supplier/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SupplierLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (user.user?.id) {
    const { data: business } = await supabase
      .from("supplier_businesses")
      .select("*")
      .eq("profile_id", user.user?.id)
      .single();

    if (!business) {
      redirect("/create-business");
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
