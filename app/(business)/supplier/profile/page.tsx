import { Profile } from "@/components/supplier/profile";
import { ProfileSkeleton } from "@/components/supplier/skeletons";
import { Suspense } from "react";

const BusinessProfilePage = async () => {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile />
    </Suspense>
  );
};

export default BusinessProfilePage;
