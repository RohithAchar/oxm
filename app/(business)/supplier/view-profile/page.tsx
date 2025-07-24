// app/(business)/supplier/view-profile/page.tsx

import { createClient } from "@/utils/supabase/server";
import ViewProfile from "./components/view-profile";

const ViewProfilePage = async () => {
  const supabase = await createClient();
  const { data: res, error: userError } = await supabase.auth.getUser();

  if (userError || !res.user) {
    return (
      <div className="min-h-[calc(100vh-50px)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-gray-600">
              Unauthorized or failed to get user.
            </p>
          </div>
        </div>
      </div>
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
