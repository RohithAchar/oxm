"use client";

import { usePathname } from "next/navigation";
import Container from "@/components/common/Container";
import { GlobalBreadcrumbs } from "@/components/Breadcrumbs";

export default function RootMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main
      className={isAdmin ? "pt-0 md:pt-0 md:pb-0" : "pt-14 md:pt-14 md:pb-0"}
      style={{
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <Container>
        {!isAdmin && <GlobalBreadcrumbs />}
        {children}
      </Container>
    </main>
  );
}
