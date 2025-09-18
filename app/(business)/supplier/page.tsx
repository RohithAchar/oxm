import { redirect } from "next/navigation";

const SupplierDashboard = () => {
  redirect("/supplier/overview");
  return <div>SupplierDashboard</div>;
};

export default SupplierDashboard;
