import { redirect } from "next/navigation";

const SupplierDashboard = () => {
  redirect("/supplier/add-product");
  return <div>SupplierDashboard</div>;
};

export default SupplierDashboard;
