import { AdminSidebar } from "@/components/admin/sidebar";
import { createClient } from "@/utils/supabase/server";
import { GlobalBreadcrumbs } from "@/components/Breadcrumbs";
import { ModeToggle } from "@/components/nav/theme-toggle-button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/footer";

export const metadata = {
  title: "Admin | OpenXmart",
  description: "Manage suppliers, products, and platform operations.",
  keywords: ["B2B admin", "admin portal", "manage business", "OpenXmart admin"],
};

export default async function AdminLayout({
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
    <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-0 py-0">
      <SidebarProvider>
        <AdminSidebar
          profileUrl={profileUrl}
          name={name}
          username={username}
          email={email}
          userProfileUrl={profileUrl}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <GlobalBreadcrumbs />
            <div className="ml-auto hidden md:flex items-center gap-2">
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
