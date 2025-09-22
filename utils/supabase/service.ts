import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Service role client to bypass RLS for trusted server actions
export const createServiceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
