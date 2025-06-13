import LogoutButton from "@/components/LogoutButton";
import { createClient } from "@/utils/supabase/server"; // Add this import
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your dashboard!
              </h2>

              <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  User Information
                </h3>

                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Email:
                    </dt>
                    <dd className="text-sm text-gray-900">{user.email}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      User ID:
                    </dt>
                    <dd className="text-sm text-gray-900 font-mono">
                      {user.id}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Provider:
                    </dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {user.app_metadata?.provider || "Unknown"}
                    </dd>
                  </div>

                  {profile?.full_name && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Full Name:
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {profile.full_name}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
