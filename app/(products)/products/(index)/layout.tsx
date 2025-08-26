import { Sorting } from "@/components/product/sorting";
import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto pb-24 md:pb-0 space-y-4">
      <Suspense fallback={null}>
        <Sorting />
      </Suspense>
      <main className="pt-24">{children}</main>
    </div>
  );
};

export default Layout;
