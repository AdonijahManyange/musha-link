import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);