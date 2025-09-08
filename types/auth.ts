import { User as SupabaseUser } from "@supabase/supabase-js";

export type AuthSession = {
  supabaseUser: SupabaseUser;
};

export interface OTPVerificationData {
  phone: string;
  token: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  user?: any;
}
