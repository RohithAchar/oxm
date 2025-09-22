// app/(business)/supplier/layout.tsx

import { createClient } from "@/utils/supabase/server";
import { SupplierBreadcrumbs } from "@/components/Breadcrumbs";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/nav/theme-toggle-button";
import { NotificationsBell } from "@/components/nav/NotificationsBell";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/footer";

export const metadata = {
  title: "Supplier portal | OpenXmart",
  description:
    "Manage your business profile, products, orders, and communications with buyers.",
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

    businessData = business;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-0 py-0">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="-mt-14 md:-mt-14">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <SupplierBreadcrumbs />
            <div className="ml-auto hidden md:flex items-center gap-2">
              <NotificationsBell />
              <ModeToggle />
            </div>
          </header>
          <main>
            <div className="mx-auto px-3 md:px-6">{children}</div>
          </main>
          <Footer fullWidth={false} />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
