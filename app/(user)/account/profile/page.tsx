import { getUser } from "@/lib/controller/user/userOperations";
import { ProfileEditForm } from "./components/profile-edit-form";
import { Suspense } from "react";
import { ProfileCardSkeleton } from "@/components/user/skeletons";

const ProfileEditPage = async () => {
  const { user } = await getUser();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <p className="text-muted-foreground">
          Update your personal information and profile picture.
        </p>
      </div>

      <Suspense fallback={<ProfileCardSkeleton />}>
        <ProfileEditForm user={user} />
      </Suspense>
    </div>
  );
};

export default ProfileEditPage;
