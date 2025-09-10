import { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
