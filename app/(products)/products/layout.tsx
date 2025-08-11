const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <p>SideBar</p>
      {children}
    </div>
  );
};

export default Layout;
