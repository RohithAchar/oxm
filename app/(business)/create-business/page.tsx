// app/(business)/create-business/page.tsx

import { SupplierBusinessForm } from "@/components/supplier/supplier-business-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const CreateBusinessPage = async () => {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user.user?.id) {
    redirect("/login");
  }

  // Fetch existing business data
  const { data: business, error } = await supabase
    .from("supplier_businesses")
    .select("*")
    .eq("profile_id", user.user.id)
    .single();

  // If business exists and is verified, redirect to supplier dashboard
  if (business && business.is_verified === true) {
    redirect("/supplier");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <SupplierBusinessForm existingBusiness={business} />
    </div>
  );
};

export default CreateBusinessPage;
