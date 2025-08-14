const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto pb-24 md:pb-0 space-y-4">
      <div className="bg-background fixed top-13 left-0 right-0 z-50 grid grid-cols-2 text-center p-4 border-b">
        <p className="border-r">Sort</p>
        <p>Filters</p>
      </div>

      <main className="pt-18">{children}</main>
    </div>
  );
};

export default Layout;
