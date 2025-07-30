import { redirect } from "next/navigation";

const SupplierDashboard = () => {
  redirect("/supplier/profile");
  return <div>SupplierDashboard</div>;
};

export default SupplierDashboard;
