"use client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { FavoritesProvider } from "@/lib/contexts/favorites-context";
import { FavoriteSuppliersProvider } from "@/lib/contexts/favorite-suppliers-context";

const Providers = ({ children }: { children: React.ReactNode }) => {
  function ThemeEnforcer({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { setTheme } = useTheme();

    useEffect(() => {
      const onAdminOrSupplier =
        pathname?.startsWith("/admin") || pathname?.startsWith("/supplier");
      if (!onAdminOrSupplier) {
        setTheme("light");
      }
    }, [pathname, setTheme]);

    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>
        <FavoritesProvider>
          <FavoriteSuppliersProvider>
            <Toaster />
            <ThemeEnforcer>{children}</ThemeEnforcer>
          </FavoriteSuppliersProvider>
        </FavoritesProvider>
      </NuqsAdapter>
    </NextThemesProvider>
  );
};

export default Providers;
