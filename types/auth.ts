import { User as SupabaseUser } from "@supabase/supabase-js";

export type AuthSession = {
  supabaseUser: SupabaseUser;
};
