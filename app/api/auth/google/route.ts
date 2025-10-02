// app/api/auth/google/route.ts
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Database } from "@/utils/supabase/database.types";

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const cookieStore = await cookies();

  // Get redirect URL from request body or query params
  const body = await request.json().catch(() => ({}));
  const redirectTo =
    body.redirectTo || requestUrl.searchParams.get("redirectTo") || "/";

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${
        requestUrl.origin
      }/api/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(data.url);
}
