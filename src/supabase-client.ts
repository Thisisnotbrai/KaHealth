import { createClient } from "@supabase/supabase-js";

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabaseURL = import.meta.env.VITE_SUPABASE_URL as string;

export const supabase = createClient(supabaseURL, supabaseAnonKey);

export type { SupabaseClient } from "@supabase/supabase-js";