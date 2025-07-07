import { SupplierBusinessForm } from "@/components/supplier/supplier-business-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const CreateBusinessPage = async () => {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (user.user?.id) {
    const { data: business } = await supabase
      .from("supplier_businesses")
      .select("*")
      .eq("profile_id", user.user?.id)
      .single();
    if (business) {
      redirect("/supplier");
    }
  }

  return <SupplierBusinessForm />;
};

export default CreateBusinessPage;
