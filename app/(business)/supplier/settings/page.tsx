import { getBusiness } from "@/lib/controller/business/businessOperations";
import { getUserId } from "@/lib/controller/user/userOperations";
import SettingsClient from "./settingsClient";

export default async function SettingsPage() {
  const userId = await getUserId();
  const business = await getBusiness(userId);

  return (
    <main className="space-y-4 md:space-y-6 pb-24 md:pb-12">
      <div className="pt-2 md:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Update your business profile information.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t" />

      <SettingsClient business={business!} />
    </main>
  );
}
