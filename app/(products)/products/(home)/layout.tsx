import { Inter, Roboto, Open_Sans } from "next/font/google";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProductFilterSidebar } from "@/components/product-filter-sidebar";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export default async function ProductsLayout({
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
      .eq("profile_id", user.user.id)
      .single();

    if (!business) {
      redirect("/create-business");
    }

    if (business.is_verified === false) {
      redirect("/create-business");
    }
  }

  return (
    <div
      className={`${inter.variable} ${roboto.variable} ${openSans.variable} antialiased`}
    >
      <div className="flex min-h-screen">
        <Suspense
          fallback={
            <div className="w-80 border-r bg-background animate-pulse" />
          }
        >
          <div className="mr-4">
            <ProductFilterSidebar />
          </div>
        </Suspense>

        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <Suspense
              fallback={
                <div className="p-4 lg:p-8">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-muted rounded w-48" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-96 bg-muted rounded-2xl" />
                      ))}
                    </div>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
