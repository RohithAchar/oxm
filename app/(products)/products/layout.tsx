// app/products/layout.tsx

import { Inter, Roboto, Open_Sans } from "next/font/google";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProductFilterSidebar } from "@/components/product-filter-sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
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
    <div className={`flex min-h-screen ${inter.variable} antialiased`}>
      <ProductFilterSidebar />
      <main className="flex-1 pl-4">{children}</main>
    </div>
  );
}
