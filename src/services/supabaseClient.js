// Single Supabase browser client. Uses the publishable/anon key (safe in the client).
// If config is missing, `supabase` is null and the app runs in honest local mode.
import { createClient } from "@supabase/supabase-js";
import { ENV, isConfigured } from "./env.js";

export const supabase = isConfigured.supabase()
  ? createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
