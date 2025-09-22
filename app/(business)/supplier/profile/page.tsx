import { Profile } from "@/components/supplier/profile";
import { ProfileSkeleton } from "@/components/supplier/skeletons";
import { Suspense } from "react";

export const metadata = {
  title: "Profile | Supplier Portal | OpenXmart",
  description:
    "Manage your business profile, verification status, and account settings.",
};

const BusinessProfilePage = async () => {
  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Profile
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Manage your business profile, verification status, and account
          settings.
        </p>
      </div>
      <div className="border-t" />
      <Suspense fallback={<ProfileSkeleton />}>
        <Profile />
      </Suspense>
    </main>
  );
};

export default BusinessProfilePage;
