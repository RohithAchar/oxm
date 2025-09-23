"use client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { FavoritesProvider } from "@/lib/contexts/favorites-context";
import { FavoriteSuppliersProvider } from "@/lib/contexts/favorite-suppliers-context";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>
        <FavoritesProvider>
          <FavoriteSuppliersProvider>
            <Toaster />
            {children}
          </FavoriteSuppliersProvider>
        </FavoritesProvider>
      </NuqsAdapter>
    </NextThemesProvider>
  );
};

export default Providers;
