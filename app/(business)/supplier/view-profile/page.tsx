// app/(business)/supplier/view-profile/page.tsx

import { createClient } from "@/utils/supabase/server";
import ViewProfile from "./components/view-profile";

const ViewProfilePage = async () => {
  const supabase = await createClient();
  const { data: res, error: userError } = await supabase.auth.getUser();

  if (userError || !res.user) {
    return (
      <ViewProfile data={null} error="Unauthorized or failed to get user." />
    );
  }

  const { data: business, error: businessError } = await supabase
    .from("supplier_businesses")
    .select("*")
    .eq("profile_id", res.user.id)
    .single();

  return (
    <ViewProfile
      data={business || null}
      error={businessError?.message || null}
    />
  );
};

export default ViewProfilePage;
